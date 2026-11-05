# Rendering and performance implementation plan

Status: plan only, nothing implemented. Produced after five read-only audits of `apps/codebility` plus a repo-wide pattern sweep. Every claim below was verified by reading the file or by a grep over the whole app.

---

## 1. Two corrections to the previous report

### 1.1 PermissionsProvider is still there

The user-visible improvement is real, but it lives in the proxy, not in the client provider. Both paths exist today:

| Path | File | Status |
|---|---|---|
| Proxy computes permissions and sends `x-codev-access` | [proxy.ts](apps/codebility/proxy.ts) `accessHeaders()`, decoded by [proxy-access.ts](apps/codebility/lib/global/proxy-access.ts) | live, consumed by HomeNavbar and HomeSidebar (server components) |
| Client provider calls `getPermissionsAction()` on mount | [PermissionsProvider.tsx](apps/codebility/providers/global/PermissionsProvider.tsx#L35), mounted at [layout.tsx](apps/codebility/app/home/layout.tsx#L60) | still live, still a server action per document load |
| Consumer of that provider | `usePermissions` | grep finds **one** hit: its own definition. Nothing calls it |

So the provider is a second, unconsumed path. Removing it costs nothing and deletes one server action per /home load plus the whole action file.

### 1.2 Why `requireIdentity` calls `auth.getUser` twice

```
requireIdentity()                       lib/global/authorize.ts:46
  ├─ supabase.auth.getUser()            authorize.ts:52        <- network call #1
  ├─ getAccess()                        lib/global/permissions.ts:17
  │    └─ getCurrentCodev()             lib/global/current-codev.ts:7
  │         └─ supabase.auth.getUser()  current-codev.ts:17    <- network call #2
  │    └─ select roles                  permissions.ts:35
  └─ getCurrentCodev()                  authorize.ts:59        (React cache hit, no call)
```

Two independent wrappers each resolve the session for themselves: `requireIdentity` needs a user id, and `getCurrentCodev` needs the same id to select the row. Nothing shares the first result. React `cache()` dedupes each wrapper individually within a request, not across wrappers.

Target: one `getSessionUser()` wrapped in `cache()`, used by both, so a guarded action costs 1 auth call + 1 codev select + 1 roles select. The roles select can be removed entirely with a cached role lookup keyed by role id (roles change rarely), leaving 2 round trips.

---

## 2. Target pattern (the acceptance bar for every workstream)

1. The static shell of a route renders without waiting on data: heading, tabs, filter bar, table header, breadcrumbs.
2. Dynamic data streams inside a Suspense boundary that wraps **only** the data region.
3. Navigation is optimistic: the clicked tab/filter/page changes appearance immediately; the previous content stays visible and dimmed until the new content arrives.
4. Lists are paginated, searched, filtered and sorted in SQL. The browser never receives a set it will re-paginate.
5. Reads are server components or cached functions. Server actions are mutations only.
6. Queries select rendered columns and carry explicit limits.
7. Mutations authorize with `authorize()`/`requireIdentity()` and scope by project or owner.
8. Dates and random values format with a pinned locale and time zone on one side only.

---

## 3. Verified inventory

Repo-wide greps over `apps/codebility`:

| Pattern | Count | Meaning |
|---|---|---|
| `export const instant = false` | 20 route/layout files | shell validation and instant-navigation checks are off for most of the app, including `app/home/layout.tsx:19` which covers all of /home |
| `export const prefetch` | 2 (`(marketing)/layout.tsx`, `home/layout.tsx`) | redundant with `partialPrefetching: true` in next.config.mjs |
| `loading.tsx` files | 3 | only kanban routes have a streamed fallback |
| `.from()` in `lib/**` | 51 calls across 19 files | data access |
| `.range()` in `lib/**` | 5 | pagination exists almost nowhere |
| `.limit()` in `lib/**` | 0 | no query is capped |
| `"use server"` in `lib/**` | 2 (`supabase-server.ts`, `applicants/supabase-admin.ts`) | server-only factories exposed as client-callable actions |
| components importing actions | 61 imports across 29 action files | the read-via-action surface |
| `useLinkStatus` | 0 | no per-link pending state anywhere |
| `useTransition`/`useOptimistic` | 16 uses in 8 files | isolated, mostly marketing |
| `router.refresh()` | 30 sites in 12 files | mutations reload the world instead of patching state |
| `toLocale*` in `.tsx` | 21 sites in 13 files | locale/timezone formatting, mixed pinned and unpinned |
| `Math.random()` in `.tsx` | 13 sites | render-time randomness risk |
| Suspense usages | 33 in 31 files | mostly whole-page boundaries |

---

## 4. Workstream A: one identity resolution per request

**Goal:** every guarded read/action resolves the caller once.

Steps:
1. Add `lib/global/session.ts` with `getSessionUser = cache(async () => supabase.auth.getUser())` and `getSessionIdentity` returning `{ userId, codev, access }`.
2. Rewrite [current-codev.ts](apps/codebility/lib/global/current-codev.ts) to consume `getSessionUser()` instead of calling `auth.getUser()`.
3. Rewrite [authorize.ts](apps/codebility/lib/global/authorize.ts) `requireIdentity` to consume the same.
4. Cache the role lookup: `getRolePermissions(roleId)` with `"use cache"` + `cacheLife("hours")` + `cacheTag("roles")`, invalidated by the settings actions that change roles.
5. Remove `PermissionsProvider` from [layout.tsx](apps/codebility/app/home/layout.tsx), delete the provider and [actions/global/permissions.ts](apps/codebility/actions/global/permissions.ts). Any future client consumer reads permissions from a server component prop or the proxy header.
6. Remove `"use server"` from [supabase-server.ts](apps/codebility/lib/global/supabase-server.ts) and [supabase-admin.ts](apps/codebility/lib/home/applicants/supabase-admin.ts); add `import "server-only"`.

Acceptance: a guarded action issues 1 auth call and 1 codev select (2 total), verified with `PERF_LOG=1` and the `[perf] auth.getUser` lines; `getPermissionsAction` no longer appears in a network log for /home; the app builds.

Risk: low. Touches identity resolution used everywhere, so the gate is `check:auth` plus an E2E login pass.

---

## 5. Workstream B: data fetching

### B1. Applicants (partially done)
Done: server pagination (`?page=`), server search (`?q=`), optimistic tab highlight.
Remaining:
- `APPLICANT_SELECT` still embeds `applicant (*)` including base64 `signature_data`, `nda_signature`, `nda_document`. Replace with the 12 rendered columns plus the 8 applicant fields the table shows; fetch modal-only fields when the modal opens.
- Facet filters are decorative: `applicantHeaders.tsx` stores them and never applies them. Either map each facet to a query predicate and to search params, or delete the panel.
- `getApplicantCounts` runs 5 head counts per render; replace with one grouped RPC or a cached counts read keyed by an `applicants` cache tag.
- Add `app/home/applicants/loading.tsx` for the shell.

### B2. Profiles and public listings (same bug as applicants)
- [profiles-listing-cached.ts](apps/codebility/lib/global/profiles-listing-cached.ts#L69) fetches every passed codev, filters and sorts in JS, slices per page. Move eligibility into SQL, add `{ count: "exact" }` and `.range()`, cache positions separately.
- [codev-service.ts](apps/codebility/lib/global/codev-service.ts#L30) selects the widest relation graph in the repo with no limit. Add a narrow `getCodevById` for the marketing modal (4 fields) and cap the rest.
- [proposal-public.ts](apps/codebility/lib/global/proposal-public.ts#L15): `select("*")` over all projects; two unbounded lists. Project the rendered columns, add limits.
- [codevs-featured-projects-cached.ts](apps/codebility/lib/global/codevs-featured-projects-cached.ts#L38): all projects for `main_image` only. Select one column, limit.
- [onboarding-team.ts](apps/codebility/lib/global/onboarding-team.ts#L18): two unbounded graph fetches for five scalars.

### B3. Kanban and projects
- `loadBoardSnapshot` is five sequential queries; batch the embeds and guard the empty-columns `.in()`.
- `getCachedProjects` maps `kanban_display` but never filters.
- `getCachedContributors` has no order and no limit.
- `PROJECT_LIST_COLUMNS` / `PROJECT_DETAIL_COLUMNS` carry unrendered fields (`project_code`, dates, images).

### B4. Reads that are actions
Move every reader out of `actions/` and pass data from the server or a cached function:
`getOnboardingProgress`, `getPermissionsAction` (deleted), `getCodev`, `getTaskSkillCategories`, `getTaskDetail`, `searchAssignees`, `getAssigneesByIds`, `searchContributorCandidates`, `getUsernameData`, `checkUsernameAvailability`, `getImagePath`, `getBoardSnapshot`.
Typeaheads keep their actions but seed page 0 from the server and debounce.

### B5. Duplicate fetches
- `auth.getUser` twice per guard (Workstream A).
- `/applicant/profile` calls `getUser` four times (page, `loadProfilePoints`, `getCurrentCodev`, `getPositions`).
- `education`/`work_experience` read by the page and again by `profile-points`.
- `/profiles/[id]` queries the same codev twice (metadata + body).
- `/codevs` fetches positions twice; `/careers` fetches departments twice.
- `getTaskDetail` re-reads the task after `requireProjectAccessForEntities` already resolved it.

---

## 6. Workstream C: static shell

### C1. Route-by-route boundary split

| Route | Today | Target |
|---|---|---|
| /home/applicants | one boundary around H1, search, filters, tabs, table | H1 + tabs + search in the page, boundary around the table only |
| /home/projects | page shell is H1 + overlays, content streamed | keep, but gate overlays on `hasFullAccess` |
| /home/projects/[projectId] | boundary wraps breadcrumb, header and content | static breadcrumb + title skeleton outside |
| /home/kanban | H1 static, table streamed | fine |
| /home/kanban/[projectId] | boundary wraps breadcrumb/title/button | hoist breadcrumb + heading |
| /home/kanban/[projectId]/[sprintId] | boundary wraps breadcrumb/H1/board | hoist breadcrumb + H1 |
| /home/account-settings | header static, content streamed | fine |
| /applicant/profile | one boundary around the entire page | hoist H1/description, suspend each section |
| /proposal | one boundary around header, tabs, footer | static shell, stream the tab panel |
| /(marketing)/profiles | filter renders inside the data component | lift the filter above the boundary |
| /(marketing)/contact | whole page client-side and CSS-hidden until hydration | render the form chrome as server components |

### C2. Segment flags
1. Delete `export const instant = false` from `app/home/layout.tsx:19`; add it back only where a real shell is impossible.
2. Delete the per-segment `prefetch` exports.
3. Remove `instant = false` from static auth pages (`sign-in`, `verify`, `password-reset`, `declined`, `2fa-challenge`).
4. Add `loading.tsx` to `/home/applicants`, `/home/projects`, `/home/account-settings` that render the frame, not the whole page.

### C3. Marketing visibility
`globals.css:907-933` hides `[data-landing-content]` until hydration; with JS off the marketing site is blank and the HTML is invisible. Remove the visibility gate; keep animation on top of visible content.

---

## 7. Workstream D: optimistic interaction

1. **Tab/filter/page navigation** (applicants done): seed active state locally, set it on click, `startTransition` around `router.push`, dim the previous content, revert on error. Apply the same to:
   - marketing services tabs, careers filters, profiles filter, codevs filter
   - sidebar links (`LeftSidebarClient.tsx:159`) via `useLinkStatus` or a pending href
2. **Mutations**: replace `router.refresh()` with optimistic state.
   - applicants row actions (17 refresh sites)
   - profile forms (About, ContactInfo, TimeSchedule, Skills)
   - project header edit/mark-done, create drawer, contributor picker
   - account settings 2FA
   Each action returns the updated row; the component patches it in place and rolls back on error.
3. **Reminder actions** never refresh today (`applicantActionButton.tsx:256-306`); give them the same optimistic path.
4. **Reads started on mount** (onboarding progress, permissions, username, task detail, assignees) become props from the server, removing their loading flashes.
5. **Quiz grading** moves server-side; the client sends answers, not a verdict.

---

## 8. Workstream E: hydration determinism

Pin all formatting to `en-US` + `Asia/Manila` through one helper (`utils/global/date.ts` already has the pattern):
- `constants/home/applicants/applicants.tsx` (5 sites, already pinned)
- `ApplicantProfileModal.tsx` (3), `applicantProfileColSec.tsx` (3), `process-timeline.ts` (1)
- `JobCard.tsx` (1), `ProjectDetail*` (3), `KanbanSprintsTable.tsx` (1), `services.ts`, `contact.ts`

Render-time clocks and randomness:
- `useCountdown` must start from `null` on both sides (`DeclinedCountdown`, `testCountDown`).
- `BubbleBackground` generates bubbles in `useEffect`.
- `ContactAppointment` computes "today" in an effect.
- `StickyLogo` uses `useMediaQuery`.
- `toBeFailed` row classes derive from a server-provided flag.

---

## 9. Workstream F: authorization gaps found by the audit

These are behaviour changes and need sign-off, listed separately from performance:
1. `updateCodev` spreads client input: allowlist profile fields, reject `role_id`, `application_status`, `internal_status`, `rejected_count`.
2. `updateCodevNdaUrls` and `completeNdaSigning` remain public for the token flow, but `updateCodevNdaUrls` accepts any `codevId`; scope it to the token or an identity.
3. `updateProject`/`deleteProject`/`markProjectDone` and contributor add/remove only check the `projects` permission; add `requireProjectAccess(projectId, "team_leader")`.
4. `searchAssignees`/`getAssigneesByIds` check only `kanban`, so any holder can enumerate any project's members; add project access.
5. `getUsernameData` takes an arbitrary `userId` with no guard; derive it from the session.
6. `getCodev` and `sentHireCodevEmail` are unguarded reads/emails callable from a public modal.
7. `contact-appointment` inserts into the DB with the service-role key and no validation.

---

## 10. Workstream G: dead code

Delete after confirming zero imports: `getClients`, `getEducation`, `getWorkSchedule`, `getJobStatuses`, `getCurrentCodevAction`, `actions/auth/onboarding/onboarding-team.ts`, `getBoardSnapshot`, `persistProfilePoints`, `utils/home/applicants/applicant-filtering.ts` (unused while filters are decorative), the duplicate `Suspense` in `LandingIntern.tsx`, `useNavStore()` call in `ConditionalMainWrapper`, `PermissionsProvider`.

---

## 11. Execution order

| Batch | Contents | Why first | Gate |
|---|---|---|---|
| 1 | A (identity once), remove PermissionsProvider + action, remove `use server` from lib factories | affects every request and every action; smallest diff with the widest effect | `check:auth`, typecheck, login E2E, `PERF_LOG` shows 1 auth call |
| 2 | C2 flags + deleted `instant` + `loading.tsx` for three routes | makes shell regressions visible in CI instead of silent | build logs show instant-nav warnings only where intended |
| 3 | B1 remainder (projection, counts, filters decision) + B2 profiles | the two largest payloads in the app | payload bytes and rows/nav measured before/after |
| 4 | C1 route splits, one route per PR | visual risk, needs a screenshot diff per route | Playwright screenshots at 1440 and 390 |
| 5 | D optimistic mutations and navigation outside applicants | touches many components; do after shells are stable | click-to-highlight and click-to-content measured |
| 6 | E hydration, F authorization, G deletions | independent, low coupling | lint/typecheck/build + targeted E2E |

---

## 12. Verification harness (same for every batch)

1. `pnpm --filter codebility check:auth`, `lint`, `typecheck`, `pnpm codebility:build`.
2. Playwright against `next start` with `PERF_LOG=1`:
   - navigation: click to active-state change, click to new-content render
   - payload: document/RSC bytes and rows per navigation
   - request count: RSC fetches per navigation, server actions per page load
   - console: errors, hydration mismatches, failed requests
3. Screenshot at 1440x900 and 390x844 for every route whose shell changes.
4. Record before/after numbers in the PR description; a change without a measured delta is not done.

---

## 13. Risks

- Removing `instant = false` may surface build warnings for routes that genuinely cannot render a shell; handle route by route, not in bulk.
- Optimistic mutations change error reporting; every optimistic patch needs a rollback path and a toast.
- Project-scoping project actions changes access for non-full-access users; confirm with the product owner before shipping (Workstream F item 3).
- Cached role permissions introduce staleness; invalidate on the settings write path and keep the TTL short.
## 14. Schema drift: codev_total_points

`/profiles` filters qualified talent with `public.codev_total_points`, a view that exists in the live project and in `types/global/supabase.ts` but is not created by any migration. The view was created outside the migration history, so a database provisioned from `supabase/migrations` alone would fail at runtime on /profiles.

Current guard: `supabase/migrations/20261105_require_codev_total_points.sql` fails the migration run with an explicit message when the view is absent, instead of letting the page break later.

To adopt it properly, capture the definition from the live database and add it to a migration:

```sql
select pg_get_viewdef('public.codev_total_points'::regclass, true);
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'codev_total_points';
```

Then add `create or replace view public.codev_total_points as <definition>` plus the grants, with `anon` and `authenticated` select, and delete the guard migration in the same commit.

The same drift risk applies to the other views listed in `database.md` (`profile_points`, `public_codev_profiles`, `mentor_users`): none of them are created by a migration. A full baseline dump is the durable fix.

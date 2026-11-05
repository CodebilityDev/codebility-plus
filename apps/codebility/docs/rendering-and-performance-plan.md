# Rendering and performance plan

Audit baseline: five read-only passes over apps/codebility (applicants feature, /home routes, actions and lib, client components, public/auth/applicant flows). Findings below are ordered by user-visible impact, not by file.

## Target pattern

1. Static shell first: headings, tabs, filters, table headers render without waiting on data.
2. Dynamic data streams inside a Suspense boundary. The boundary never wraps the page chrome.
3. Navigation is optimistic: the clicked tab/filter/page highlights immediately and the previous content stays visible, dimmed, until new content arrives.
4. Lists are paginated, filtered, searched and sorted in SQL. The browser never receives a set it will re-paginate.
5. Reads are server components or cached functions. Server actions are mutations only.
6. Queries select the columns the UI renders, with explicit limits.
7. Mutations guard with authorize()/requireIdentity() and scope by project or owner.
8. Dates and random values format on one side with a pinned locale and time zone.

## P0 - biggest wins, small diffs

| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | lib/home/applicants/applicants.ts:14 | `applicant (*)` ships base64 `signature_data` and NDA blobs for every row | Select only rendered columns; fetch modal-only fields on open |
| 2 | app/home/layout.tsx:19 | `instant = false` disables shell validation for every /home route | Remove it; keep it only where a shell is genuinely impossible |
| 3 | app/home/layout.tsx:60 | PermissionsProvider calls a server action on every load; `usePermissions` has no consumers; the proxy already sends `x-codev-access` | Delete provider and action |
| 4 | lib/global/authorize.ts:52 | `requireIdentity` calls auth.getUser, then getAccess -> getCurrentCodev -> auth.getUser again | Resolve the user once and share it |
| 5 | components/home/kanban/TaskCreateDrawer.tsx:150 | Skill categories fetched by an action on every board load, drawer closed | Pass from the server page or cache once |
| 6 | app/home/kanban/[projectId]/[sprintId]/page.tsx:36 | Board loads before the access check | Authorize first, then load |
| 7 | actions/home/projects/projects.ts:95,114,193 and contributors.ts:87,135 | Permission-only guards on project rows | `requireProjectAccess(projectId, "team_leader")` |
| 8 | actions/applicant/profile/applicant-profile.ts:22 | `updateCodev` spreads client data, allowing role_id/application_status self-escalation | Allowlist profile fields |
| 9 | components/applicant/onboarding/Quiz.tsx:44 | Pass/fail computed in the browser and trusted by the action | Send answers, grade server-side |

## P1 - shell and data-path rework per route

### /home/applicants (done)
Server pagination with `?page=`, server search with `?q=`, optimistic tab highlight, table paged manually. Payload for the denied tab dropped from 2.9 MB to 324 KB, rows per request from 1052 to 10.
Remaining: move H1/tabs/filters above the Suspense boundary, add `loading.tsx`, wire the facet filters (currently decorative) to search params, trim the select.

### /home/projects and /home/projects/[projectId]
- Whole page behind one Suspense; breadcrumb and header are not in the shell.
- `PROJECT_LIST_COLUMNS` and `PROJECT_DETAIL_COLUMNS` carry unrendered fields (`project_code`, dates, images).
- Contributor list unbounded and unordered.
- Contributors and project loaded before the access check.

### /home/kanban
- `kanban/[projectId]` serialises three await stages before the breadcrumb.
- `loadBoardSnapshot` is five sequential queries; batch the embeds.
- `getCachedProjects` maps `kanban_display` but never filters on it.
- Realtime task subscription has no filter.

### /profile, /profiles, /codevs, /careers, /services, /proposal, /contact
- `profiles-listing-cached.ts` fetches every passed codev and paginates in memory.
- `codev-service.ts` selects the widest relation graph in the repo, unbounded, for a modal that needs four fields.
- `proposal-public.ts` uses `select("*")` and two unbounded lists.
- Marketing sections are server-rendered but CSS-hidden until hydration; /contact shows nothing without JS.
- Filters/tabs on those pages highlight only after the server responds.

## P2 - interaction polish

- `router.refresh()` after every applicants mutation; replace with optimistic row patches.
- Profile forms, project header, create drawers: optimistic values instead of refetch.
- `useCountdown` renders Date.now() on the server and client; start from null.
- Unpinned `toLocaleDateString()` in applicant modal, profile column, careers cards, timeline.
- `BubbleBackground` randomises during render.

## P3 - data layer hygiene

- Read actions called from client components: `getOnboardingProgress`, `getPermissionsAction`, `getCodev`, `getTaskSkillCategories`, `getTaskDetail`, `searchAssignees`, `getAssigneesByIds`, `searchContributorCandidates`, `getUsernameData`, `checkUsernameAvailability`.
- Unbounded selects listed in the actions/lib audit; add limits or SQL filters.
- Duplicate reads per request: codev row, education/work_experience, auth.getUser, tasks->columns->boards chain.
- Dead code: `getClients`, `getEducation`, `getWorkSchedule`, `getJobStatuses`, `getCurrentCodevAction`, `getTeamData`, `getBoardSnapshot`, `persistProfilePoints`.

## Verification for every item

1. `pnpm --filter codebility lint`, `typecheck`, `pnpm codebility:build`, `check:auth`.
2. Playwright against `next start`: click-through of the affected route, console errors, failed requests, hydration count.
3. For navigation work: measure click to active-state change and click to new-content render, separately.
4. For data work: record payload size and rows per navigation before and after.

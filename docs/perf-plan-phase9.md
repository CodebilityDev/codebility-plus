# /home Phase 9 — Kill data-fetching `useEffect`, paginate on the server, project only what renders

**Repo:** `C:\Users\Programming\Desktop\Projects\Compile\Work\codebility-plus`
**App:** `apps/codebility`
**Branch:** `optimize/landing`
**Baseline commit:** `54af45f7`
**Stack:** Next **15.3.7** (App Router, Turbopack), React **19.1.0**, TanStack Query 5, Zustand, Supabase

This is an execution spec, not a summary. Every number below was measured on the
current tree. Follow it top to bottom, and **verify after every section**.

---

## 0. The four rules this whole plan enforces

Every change must satisfy all four. If a change violates one, it is wrong even
if the page still renders.

### Rule 0 — Server Components fetch. Client fetching is a last resort.

**Default: the data is `await`ed in an `async` Server Component and cached on the
server.** The HTML arrives with the data already in it. No loading state, no
waterfall, no client bundle cost for the fetching code, no credentials shipped to
the browser.

Client-side fetching is permitted **only** when one of these is true, and you must
name which one in your report:

| # | Condition | Example in this app |
|---|---|---|
| C1 | The data changes in response to an interaction that must not re-run the server route | table page/filter/sort where a full navigation would be wrong |
| C2 | The flow is heavy and stateful, where round-tripping the server per change is infeasible | **kanban** (drag-and-drop, optimistic reorder) — **excluded from this plan** |
| C3 | The data is per-interaction and cannot exist at render time | typeahead/mention search, "open row → load detail" |
| C4 | Genuinely realtime | Supabase `.channel()` subscriptions, notification polling |

"It is already a client component" is **not** a reason. Neither is "it needs
`useState`". Split the component: a Server Component fetches and passes data into
a `"use client"` island that owns the interactivity. `app/home/feeds/page.tsx` +
`_components/FeedsPageClient.tsx` is the existing example — copy that shape.

**Server-side caching is part of this rule, not an optional extra.** Every server
fetch must land in one of:

| Data | Cache |
|---|---|
| Identical for every user (skill categories, role lists, banners, static reference) | `unstable_cache` with an explicit tag, invalidated by `revalidateTag` |
| Per-user, reused several times in **one** request | React `cache()` — see `lib/server/current-codev.ts` |
| Per-route render output | Router Cache via `staleTimes` (already configured) + `revalidatePath` on mutation |

`unstable_cache` **cannot** wrap anything that reads cookies or headers — it will
throw, or worse, serve one user's data to another. Per-user data uses `cache()`,
never `unstable_cache`.

When a client fetch is justified under C1/C3, it still does **not** fetch page 1:
the server renders the first page and seeds the client cache through
`initialData`. The client only fetches what the user's interaction actually asked
for.

### Rule 1 — A `useEffect` may never fetch data

Fetching in an effect means: render → paint empty → effect → network → re-render.
The user watches a skeleton for a round trip that the server could have done
before the HTML was sent.

**Current state: 239 effects, 84 of them fetch data** (excluding kanban).

Replacement table — pick by what the effect actually does:

| The effect... | Replace with |
|---|---|
| fetches on mount | `async` Server Component; `await` the data and pass it down |
| fetches when a prop/state changes (tab, page, filter) | TanStack Query keyed on that value, **seeded with `initialData`** |
| derives state from props | compute during render, or `useMemo` |
| resets state when a prop changes | `key` prop on the child |
| debounces user input | `useDeferredValue` |
| syncs to a DOM/browser API | **keep it** — this is what effects are for |

### Rule 2 — Lists are paginated on the server, and pages are cached

Never `select()` an entire table and slice it in the client.

- The server action takes `page` + `pageSize` and uses Supabase `.range()`.
- It returns `{ rows, total, page, pageSize }`.
- **The first page is rendered by the Server Component** and passed down as
  `initialData`. Page 1 must cost **zero** client requests.
- Subsequent page/filter changes qualify as C1, so they may use TanStack Query
  with `queryKey: [resource, { page, pageSize, ...filters }]` and
  `placeholderData: keepPreviousData`.
- **Going back to a page already visited must issue no request** — it is already
  in the cache.

If a table has no interactive paging (it is read-only, or paging can be a real
navigation), use `searchParams` and keep it **100% server-rendered**. Reach for
TanStack Query only when a full navigation would actually be the wrong UX.

### Rule 3 — Fetch only the columns that render

A table showing avatar, name, email, role, position, status selects **exactly**
those six plus `id`. The full record is fetched **only when a row is opened**,
by a separate `getXDetail(id)` server action (C3), cached under
`[resource, "detail", id]` so reopening the same row costs nothing.

---

## 1. Environment — read before running anything

```powershell
# Typecheck — the ONLY reliable type gate. From apps/codebility.
node ..\..\node_modules\typescript\bin\tsc --noEmit --pretty false

# Dev server (from repo root)
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility

# Production build (from repo root)
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility:build
```

Traps that will cost you an hour each:

- **PowerShell execution policy blocks `pnpm.ps1` / `npx.ps1`.** Always go through
  `node ...pnpm.cjs`.
- **PowerShell breaks on `[` and `(` in paths** (dynamic routes, route groups).
  Use `-LiteralPath`. `git show <sha>:<path>` works, but only from the **repo
  root** with the full `apps/codebility/...` path.
- **`next.config.mjs` sets `typescript.ignoreBuildErrors` and
  `eslint.ignoreDuringBuilds` to `true`.** A green build proves nothing about
  types. Run `tsc --noEmit` separately, every time.
- **`tsc --noEmit` reports 5 pre-existing errors**, all under `.next/types/**`
  (Next 15 made `params` a Promise on 4 routes never updated). Not yours.
  Filter: `Where-Object { $_.Line -notmatch '^\.next[/\\]types' }`.
  **Source errors must be 0.**
- **Never run `codebility:build` while the dev server is running.** It overwrites
  `.next` and the dev server then throws
  `TypeError: Cannot redefine property: __import_unsupported` from the edge
  middleware and **404s every route in 1-3 ms**. This already happened twice.
  Recovery: stop all node dev processes, delete `apps/codebility/.next`, restart.
- **`reactStrictMode: true`** — dev double-invokes effects. Two calls ~0 ms apart
  are Strict Mode; ~500 ms apart are real.

### 1.1 Playwright (installed globally, not in the repo)

```js
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);
```

- Absolute path only; a bare `"playwright"` specifier fails. Use **`index.mjs`**.
- Pass **`chromiumSandbox: true`**.
- Logged-in session is in `%TEMP%\codebility-probe-profile`. **Copy it, never
  open it directly** — one process per profile:
  ```js
  const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
  const PROFILE = path.join(os.tmpdir(), "codebility-p9-profile");
  if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });
  ```
  Kill strays first:
  ```powershell
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
    Where-Object { $_.CommandLine -match "codebility-.*-profile" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  ```

**Selector traps that produce false passes** (all three hit in earlier phases):

- On `<svg>`, `className` is an `SVGAnimatedString`. Use `getAttribute("class")`.
- "A button with an svg and a numeric label" also matches the **navbar
  notification bell**. Scope by icon class *and* `getBoundingClientRect().top > 250`.
- `.animate-pulse` is used decoratively. `/home` carries **3 permanently**.
  Count only nodes with `height >= 24 && width >= 120`, and compare against each
  route's **settled baseline**, not against zero.

### 1.2 Reuse these — do not write new ones

`apps/codebility/scripts/`:

| Script | Use |
|---|---|
| `audit-effects.mjs` | **Your primary tracker.** Classifies every effect; `dataFetchingEffects` must fall each section. |
| `p8-navcache.mjs` | Router-cache revisit probe (`<Link>` clicks, not `page.goto`) |
| `suite.mjs` | Routes + interactions + timings |
| `probe-actions.mjs <route>` | Server-action POSTs grouped by action id |
| `count-points.mjs` | `/api/profile-points` request count |
| `route-inventory.mjs` | Routes, `loading.tsx` coverage, client pages |
| `verify-home/nav/modals/leaderboard.mjs` | Canonical invariants |

---

## 2. Current state — measured, do not re-derive

```
239  useEffect total
 53  in kanban (EXCLUDED)
 84  data-fetching, non-kanban   ← the target
 45  select("*") in lib/server + actions
```

Effects per route area (non-kanban):

| Area | effects | | Area | effects |
|---|---|---|---|---|
| `my-team` | **28** | | `account-settings` | 6 |
| `in-house` | **16** | | `projects` | 5 |
| `settings` | **16** | | `interns` | 5 |
| `feeds` | 13 | | `_components` | 4 |
| `overflow` | 10 | | `admin-controls` | 3 |
| `(dashboard)` | 10 | | `certificate-preview` | 3 |
| `applicants` | 9 | | `hire` | 3 |
| `announcements` | 7 | | `orgchart`, `clients` | 2 each |

Worst single files (data-fetching effects):

```
app/home/announcements/AnnouncementModal.tsx              4
app/home/my-team/_components/ChecklistManageModal.tsx     4
app/home/certificate-preview/page.tsx                     3
app/home/in-house/_components/EditDialog.tsx              3
app/home/my-team/_components/MemberChecklist.tsx          3
```

Client-side pagination (fetch-everything-then-slice):

```
overflow/_components/OverflowView.tsx                    24 hits
settings/services/_components/ServicesPageClient.tsx     14
in-house/_components/table/InHouseTable.tsx              11
projects/_components/ProjectCardContainer.tsx            10
tasks/_components/TasksContainer.tsx                      8
interns/_components/CodevList.tsx                         4
clients/_components/ClientsCard.tsx                       4
applicants/_components/_table/applicantDataTable.tsx      3
```

### 2.1 Already done — do NOT redo

Phases 1-8 are committed (`0691c0e0` … `54af45f7`). Verified working:

- MUI removed; `loading.tsx` on 39/39 routes; layout streams sidebar + mobile nav
  from one shared promise.
- `experimental.staleTimes` is set — **Router Cache confirmed working**
  (`p8-navcache.mjs`: revisits return `rsc=0`, no refetch).
- `force-dynamic` declarations: 31 → **4**.
- `getCurrentCodev` selects an explicit `CURRENT_CODEV_COLUMNS` list.
- SurveyWidget resolved in `layout.tsx` and passed as a prop — **`/home` POSTs 3 → 1**.
- Server-Component fetching on feeds, overflow, settings/services.
- `lib/client/profile-points.ts` — shared in-flight + cache, 7 callers, 2 requests.
  Has 7 passing checks: `node --experimental-strip-types scripts/check-profile-points.mjs`.
- Modal registry is **already** `lazy()`; verified 0 dialogs idle / 1 after click.
  **Leave it alone.**

Invariants currently passing — these must still pass when you finish:

```
/home POSTs 1 · tabs 9 · leaderboard rows 10 · sidebar 17 · nav 16
modals 0 idle / 1 after click · page errors 0 · tsc source errors 0
build "Dynamic server usage" 0
```

---

## 3. Build the shared primitives FIRST (reuse, don't duplicate)

Everything downstream depends on these. Build them once, in this order, before
touching any route.

### 3.1 `lib/server/paginate.ts` — one pagination contract

```ts
export type Page<T> = { rows: T[]; total: number; page: number; pageSize: number };
export type PageArgs = { page?: number; pageSize?: number };
```

Plus a helper that turns `page`/`pageSize` into a Supabase `.range()` and reads
`count` from `{ count: "exact" }`. Every paginated server action returns `Page<T>`.
**No route may invent its own shape.**

### 3.2 `lib/shared/query-keys.ts` — one key factory

```ts
export const qk = {
  codevs: {
    list: (a: object) => ["codevs", "list", a] as const,
    detail: (id: string) => ["codevs", "detail", id] as const,
  },
  // projects, clients, applicants, interns, tasks … same shape
};
```

Two rules: list keys include **every** filter/sort/page value that changes the
result; detail keys are `[resource, "detail", id]`. Ad-hoc string keys are
forbidden — they are why caches silently miss.

### 3.3 `hooks/query/use-paginated-query.ts` — one list hook

Wraps `useQuery` with the house defaults:

```ts
placeholderData: keepPreviousData,   // page changes don't blank the table
staleTime: 60_000,
gcTime: 5 * 60_000,
```

`keepPreviousData` is what makes going back to page 1 instant **and** flicker-free.

### 3.4 Check `hooks/query/reactQuery.tsx` before you start

It currently sets `refetchOnWindowFocus: true` and `refetchOnMount: true` with
`staleTime: 5 min`. Every tab refocus re-issues queries. Decide the global policy
**once**, here, and let 3.3 override per-hook. Do not scatter overrides.

### 3.5 Reuse what exists

- `app/home/_components/skeletons/RouteSkeletons.tsx` — 4 shared skeletons.
  Reuse; do not write per-route skeletons.
- `lib/client/profile-points.ts` — the in-flight + cache pattern to copy if you
  need a non-TanStack client cache.
- `in-house/_components/skeletons/` — already has table/header/loading skeletons.
- `lib/server/redis-cache.ts` (`getOrSetCache`) — already used by
  `in-house/page.tsx`. **Redis is unconfigured** (`Redis configuration missing`
  on every request), so it is currently a pass-through. Do not build a second
  server cache; if you need one, use `unstable_cache`.

---

## 4. The reference implementation — `/home/in-house`

Do this route **first and completely**. It is the template every other table
copies, and the user named it explicitly. Do not start another route until this
one passes §7.

### 4.1 What is wrong today

`app/home/in-house/page.tsx` calls `getCodevs({ filters: { application_status: "passed" } })`
with **no pagination**, then hands the entire array to a client `InHouseView`
that slices it.

`lib/server/codev.service.ts` (from L18) selects **~30 columns plus joined
`education` and `work_experience`** for every row. The table renders six fields.

So: every in-house page load pulls every passed codev, with their full education
and work history, to render avatars and names.

### 4.2 Target

1. **`lib/server/codev.service.ts`** — add `getCodevsPage(args): Promise<Page<CodevListRow>>`.
   `CodevListRow` is exactly:
   ```
   id, first_name, last_name, email_address, image_url,
   role_id, display_position, internal_status, availability_status
   ```
   No joins. Use `.range()` + `{ count: "exact" }`.
   **Keep `getCodevs` until every caller is migrated**, then delete it.

2. **Add `getCodevDetail(id)`** returning the full record (the current heavy
   select, including `education` / `work_experience`), for one id.

3. **`page.tsx`** — read `page`/`pageSize` from `searchParams`, `await`
   `getCodevsPage`, pass `initialData` to the client view.

4. **`InHouseView` / `InHouseTable`** — replace the slice with
   `usePaginatedQuery(qk.codevs.list({ page, pageSize, ...filters }))`, seeded
   from `initialData` for the first page.

5. **`InHousePreviewSidebar` / `EditDialog`** — when a row is opened, fetch
   `qk.codevs.detail(id)` via `getCodevDetail`. Cached, so reopening the same
   row is free. `EditDialog` currently has **3 data-fetching effects** — all go.

> ⚠️ **RLS landmine — read `lib/server/codev-queries.ts` header before editing.**
> It documents that querying `codev` **without filtering by `role_id`** makes
> Supabase RLS return **corrupted `role_id` values** ("returns 1000 users, but
> only 5 have correct role_id"). Any narrowed or paginated query that returns
> `role_id` must be validated against this. **Verification: pick 3 users, compare
> `role_id` before and after your change.** If they differ, use the
> `fetchCodevsByRole` / `fetchAllCodevsWithCorrectRoles` helpers in that file.
> A wrong `role_id` silently changes what the user is allowed to see.

### 4.3 Gate for in-house (all must hold)

- Network on load: **one** request, returning `pageSize` rows — not the full table.
- Payload no longer contains `education` / `work_experience`.
- Page 1 → 2 → 3 → **back to 1**: the return issues **zero** requests.
- Opening a row fetches detail once; closing and reopening it issues **zero**.
- `role_id` values identical to before for 3 sampled users.
- `audit-effects.mjs`: in-house data-fetching effects → **0**.
- Table renders the same rows, same order, same count as before.

---

## 5. Apply the same pattern to the remaining routes

Order is by payoff. After each, run §7.

| # | Route | Work | Watch for |
|---|---|---|---|
| 1 | `in-house` | §4 reference | RLS `role_id` |
| 2 | `interns` | `CodevList` slices client-side; same `getCodevsPage` | reuse #1's query, do not fork it |
| 3 | `applicants` | `applicantDataTable` slices; heavy row type | status filters must be in the query key |
| 4 | `my-team` (**28 effects**) | biggest effect count; `MemberChecklist` (3) and `ChecklistManageModal` (4) fetch on mount | month-navigation fetches are **legitimate** → TanStack Query keyed on month, not deletion |
| 5 | `projects` | `ProjectCardContainer` slices | modal opens must reuse the detail cache |
| 6 | `clients` | `ClientsCard` slices | |
| 7 | `tasks` | `TasksContainer` slices | |
| 8 | `settings` (16 effects) | mostly forms; `survey-questions` / `news-banners` fetch on mount | forms must keep working — test submit |
| 9 | `announcements` | `AnnouncementModal` has **4** fetching effects | fetch on open, not on mount |
| 10 | `account-settings` | 6 effects | |
| 11 | `(dashboard)` | 10 effects | `DashboardCurrentProjectModal` (2) fetch on open |
| 12 | `certificate-preview` | client page, 3 fetching effects | it is a `"use client"` page — convert to server + client island |
| 13 | `hire`, `orgchart`, `admin-controls` | small | |

**`overflow`, `feeds`, `settings/services`** already fetch server-side. Their
remaining effects are mostly legitimate. **Do not rewrite them** — only fix a
client-side slice if one is still there (`OverflowView` still shows 24 pagination
hits; convert that to server pagination, leave the rest alone).

**`kanban` is excluded.** Do not refactor it. It is a **regression target**: after
every section, load a board and confirm drag-and-drop still works.

---

## 6. The `useEffect` sweep

`audit-effects.mjs` classifies each effect as `FETCH` / `MIXED` / `legit` /
`review`. Work the list until **`dataFetchingEffects` is 0** outside kanban.

For each remaining effect you keep, you must be able to name the external system
it synchronises with. These are the only acceptable answers:

`addEventListener` · `IntersectionObserver` / `ResizeObserver` / `MutationObserver` ·
`setInterval` / `setTimeout` for a real timer · Supabase realtime `.channel()` ·
`matchMedia` · `localStorage` / `sessionStorage` · imperative `.focus()` ·
measuring layout (`getBoundingClientRect`)

Anything else is a refactor target.

> ⚠️ **Two deliberate render-phase writes exist. Do NOT "fix" them.**
> `store/UserProvider.ts` and `app/home/feeds/_components/Feed.tsx` seed a Zustand
> store during render, each with a ref guard and a comment explaining why.
> Moving either into an effect was already tried and made the navbar paint empty.

> ⚠️ **You may not introduce a new `useEffect`.** If you remove one, do not
> replace it with another. If you believe one is genuinely unavoidable, **stop
> and say so in your report with the reasoning** rather than adding it silently.

---

## 7. Verification — after EVERY section, not at the end

### 7.1 Commands

```powershell
cd apps\codebility

# Effect tracker — the number that must go down
node scripts\audit-effects.mjs

# Types. Source errors must be 0.
node ..\..\node_modules\typescript\bin\tsc --noEmit --pretty false

# Behaviour
node scripts\suite.mjs
node scripts\p8-navcache.mjs
node scripts\probe-actions.mjs "/home/in-house"

# Invariants
node scripts\verify-home.mjs   "http://localhost:3000/home"
node scripts\verify-nav.mjs    "http://localhost:3000/home"
node scripts\verify-modals.mjs "http://localhost:3000/home/projects"

# Build — STOP THE DEV SERVER FIRST (see §1)
cd ..\..
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility:build 2>&1 |
  Tee-Object -FilePath "$env:TEMP\p9-build.log"
Select-String -LiteralPath "$env:TEMP\p9-build.log" -Pattern "Dynamic server usage"
```

### 7.2 Write `scripts/p9-table-probe.mjs` (one script, reused per route)

Takes a route and asserts the Rule 2 / Rule 3 contract:

0. **Rule 0 gate — load the route and assert ZERO client data requests.**
   Page 1 is server-rendered, so a fresh load must issue no server-action POST
   and no `/api/*` GET for the table's own data. If it does, the fetch is still
   on the client. (Layout-level requests are exempt; measure the delta against
   `/home`, which is currently 1 POST.)
1. Load → count network requests and **record the response row count**.
   Assert `rows === pageSize`, not the full table.
2. Assert the payload has **no** unused fields (grep the response body for
   `work_experience`, `education`, `about` on a list request).
3. Page 1 → 2 → 3 → 1. Assert the **return to page 1 makes zero requests**.
4. Open a row → assert one detail request. Close, reopen → assert **zero**.
5. Assert `pageErrors.length === 0`.

Run it against every route in §5 as you finish it.

### 7.3 What to look for that a green check will not catch

- **Blank fields, not errors.** Narrowing columns produces a perfectly
  error-free page with an empty name or a missing avatar. **Look at the
  screenshot**, do not just assert "no console errors".
- **Wrong `role_id`** (§4.2). Changes permissions silently. Sample 3 users.
- **Row count drift.** A `.range()` off-by-one drops the last row of each page.
  Compare total row count before and after.
- **Sort/filter lost.** Moving sort server-side changes tie-breaking. Compare the
  first and last row of page 1.
- **A cache key missing a filter.** Symptom: change a filter, see the previous
  filter's rows. Every filter in the UI must be in the query key.
- **Stale after mutation.** Edit a row, save, and confirm the table updates.
  A paginated query must be invalidated on mutation
  (`queryClient.invalidateQueries({ queryKey: qk.codevs.list.partial })`) **and**
  the server action must `revalidatePath`.
- **Form submits.** §5 items 8-10 are forms. Actually submit one.

### 7.4 Known pre-existing issues — do not attribute these to yourself

1. **5 typecheck errors in `.next/types/**`** — Next 15 `params` Promise change.
2. **14 mutating action files with zero `revalidatePath`** — carried over from
   Phase 8 and **now more dangerous**, because `staleTimes` holds the client
   Router Cache for a long window. Worst on user-facing paths:
   `settings/news-banners.ts` (4 mutations), `dashboard/actions.ts` (6),
   `hire/actions.ts` (6), `settings/survey-questions.ts` (4),
   `promote-modal/actions.ts` (4), `my-team/attendance-*.ts` (4).
   **Fix these as you touch each route** — it is the same edit.
3. **`generateServicesPDF` is dead code** (~190 lines, no caller, confirmed at
   baseline). Preview's button says "View Proposal" and routes to `/proposal`.
4. **`app/home/(dashboard)/_components/DashboardProgressRoadmap.tsx` is dead** —
   310 lines, zero importers, still fetches `/api/profile-points`.
5. **`/home/test-notifications`, `/home/test-meeting-notification`** are test
   routes shipped in the app.
6. **`Error fetching project members: Bad Request`** — `lib/server/project-members-query.ts`.
7. **Redis unconfigured** — `getOrSetCache` is a pass-through today.
8. **TipTap SSR warning** — `Tiptap Error: SSR has been detected, please set
   immediatelyRender explicitly to false`, repeating on `/home/overflow`. Causes
   a hydration mismatch and a client re-render of that subtree. One-line fix, but
   TipTap also appears under kanban — scope carefully.
9. **`/home` shows 3 permanent `.animate-pulse` nodes** (decorative).

---

## 8. Code standards

- **Reuse before writing.** Before adding a helper, grep for one: `lib/server/`,
  `lib/client/`, `hooks/`, `components/shared/`, `app/home/_components/`. The
  primitives in §3 exist so each route is a thin consumer. If you write a second
  pagination helper, a second query-key scheme, or a per-route skeleton, you have
  done it wrong.
- **Delete what you replace.** When the last caller of `getCodevs` is migrated,
  delete `getCodevs`. Do not leave both.
- **Comments only where the code cannot speak.** A non-obvious constraint (the
  RLS `role_id` trap), a deliberate ceiling, a "this looks wrong but is
  intentional". Repo baseline is 1-5% comment lines. **Do not narrate.** No
  `// fetch the users`, no `// map over rows`, no restating the function name,
  no changelog comments ("changed from X to Y") — that is what git is for.
- **Match local style.** Read the file you are editing first.
- **Server Components fetch; Server Actions mutate.** See Rule 0. A client fetch
  requires a named C1-C4 justification in your report, and is always seeded with
  `initialData` from the server parent. If you cannot name the condition, the
  fetch belongs on the server.
- **Every server fetch is cached** per Rule 0's table. An uncached server fetch
  on a hot path is as much a defect as a client-side one.
- **Zustand with selector subscriptions**: `useStore((s) => s.field)`, never
  `const { a, b } = useStore()`.
- **Never import an async Server Component into a `"use client"` module** — it
  throws "is an async Client Component". Render it in the server layout and pass
  it down as an element prop.
- **`unstable_cache` only for data identical for every user.** It cannot wrap
  anything reading cookies/headers. Per-user data uses React `cache()` +
  Server Component + `<Suspense>`.

---

## 9. Execution order

| # | Section | Risk |
|---|---|---|
| 1 | §3 shared primitives | low — everything depends on them |
| 2 | §4 in-house reference | ⚠️ medium — RLS `role_id` |
| 3 | §5 #2-#7 tables (interns, applicants, my-team, projects, clients, tasks) | medium |
| 4 | §5 #8-#13 forms/modals/small routes | low |
| 5 | §6 final effect sweep to 0 | low |
| 6 | §7 verification | after every one of the above |

Do **not** batch sections. One section, then §7, then commit.

---

## 10. Reporting

For every section:

1. **Files changed**, one line of reasoning each.
2. **Every fetch you left on the client**, with its C1-C4 justification and the
   reason a Server Component could not do it. An unjustified client fetch is a
   failed section.
3. **Every server fetch you added**, and which cache tier it uses
   (`unstable_cache` + tag / React `cache()` / Router Cache).
4. **Effects removed**, with the replacement used. For every effect **kept**,
   name the external system it synchronises with.
5. **If you added a `useEffect`** — flag it prominently with justification.
   The standing rule is that you do not.
6. **`audit-effects.mjs` `dataFetchingEffects`**: before → after.
7. **Request counts and payload shape** before → after for each table, including
   the Rule 0 gate (client data requests on first load must be 0).
8. **What you did not do**, and why.

Measurements are **3 runs, reported as a range**. Dev timings are Turbopack
dev-mode; never quote them as production numbers. Warm a route before measuring
(first hit pays a cold compile, up to ~55 s).

**Report honestly. Measure before claiming.** From earlier phases, all real:

- An "8 → 2 requests" win was reported from **counting call sites**. Measured, it
  was **4 → 2** — two call sites were dead because the page never passed an `id`.
- Dynamic-importing `recharts` looked obviously correct and was a **no-op**; Next
  had already split it. Reverted.
- Two Playwright checks **passed against the navbar notification bell** instead of
  the element under test.
- Moving a fetch server-side made a route try to prerender, fail, and render from
  an empty `?? []` fallback — while the build still reported success. Only the
  build log showed it.

A number you did not observe is not a result.

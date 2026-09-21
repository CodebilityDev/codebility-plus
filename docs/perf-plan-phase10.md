# Phase 10 — Complete remediation of the private `/home` area

**Repo:** `C:\Users\Programming\Desktop\Projects\Compile\Work\codebility-plus`
**App:** `apps/codebility`
**Branch:** `optimize/landing`
**Baseline:** `d92d5783`
**Stack:** Next 15.3.7 (App Router, Turbopack), React 19.1.0, TanStack Query 5, Zustand, Supabase

Self-contained. Do not read Phase 8 or 9; everything still outstanding from them
is restated here. Phase 9 failed partly because its rules lived in a different
document than the work.

Every number in §2 came from a script in `apps/codebility/scripts/`, named inline.
Claims marked **measured** were reproduced against the running app with Playwright.
Claims marked **static** came from source analysis and must be confirmed by probe
before you act on them.

---

## 1. The five conditions

Every change must satisfy all five. A change that renders correctly but violates
one is wrong.

### C-1 Server Components fetch. Client fetching is a last resort.

Default: `await` the data in an `async` Server Component. The HTML ships with the
data in it. No loading state, no waterfall, no fetch code in the client bundle.

Client fetching is allowed **only** under one of these, and you must name which:

| | Condition | Example here |
|---|---|---|
| **F1** | Interaction-driven, where a full navigation would be wrong | table page / filter / sort |
| **F2** | Heavy stateful flow where a server round trip per change is infeasible | **kanban only** (excluded, §3) |
| **F3** | Per-interaction data that cannot exist at render time | open-a-row detail, mention typeahead |
| **F4** | Genuinely realtime | Supabase `.channel()`, notification polling |

"It is already a client component" and "it needs `useState`" are **not** reasons.
Split it: a Server Component fetches and passes data into a `"use client"` island.
`app/home/feeds/page.tsx` + `_components/FeedsPageClient.tsx` is the working
example in this repo. Copy that shape.

### C-2 Every fetch is cached, on the correct tier

| Data | Tier |
|---|---|
| Identical for all users (skill categories, roles, positions, project options, banners) | `unstable_cache` + explicit tag, invalidated with `revalidateTag` |
| Per-user, reused several times within one request | React `cache()` — see `lib/server/current-codev.ts` |
| Per-route render output | Router Cache (`staleTimes`, already configured) + `revalidatePath` on mutation |
| Interaction-driven client data | TanStack Query with an explicit key (§4.2) |

`unstable_cache` **cannot** wrap anything reading cookies or headers. It throws,
or serves one user's data to another. Per-user data uses `cache()`, never
`unstable_cache`.

Redis (`lib/server/redis-cache.ts`, `getOrSetCache`) logs
`Redis configuration missing - cache will be disabled` on every request and is
currently a pass-through. Do not build a second server cache around it; use the
table above.

### C-3 No `useEffect` fetches data

| The effect... | Replace with |
|---|---|
| fetches on mount | `async` Server Component, pass data down |
| fetches when a prop/state changes | TanStack Query keyed on that value, seeded per §4.1 |
| derives state from props | compute in render, or `useMemo` |
| resets state when a prop changes | `key` prop on the child |
| debounces input | `useDeferredValue`, or the shared debounce hook (§4.4) |
| syncs to a browser/DOM API | **keep it** |

An effect you keep must name the external system it synchronises with:
`addEventListener`, `IntersectionObserver` / `ResizeObserver` / `MutationObserver`,
a real timer, Supabase `.channel()`, `matchMedia`, `localStorage`, imperative
`.focus()`, or layout measurement. Anything else is a refactor target.

**Do not add a new `useEffect`.** The debounce hook in §4.4 is the single
permitted new one (timer + cleanup). If you believe another is unavoidable, stop
and say so in your report rather than adding it silently.

> Two deliberate render-phase store writes exist, each ref-guarded and commented:
> `store/UserProvider.ts` and `app/home/feeds/_components/Feed.tsx`. Moving either
> into an effect was tried and made the navbar paint empty. **Leave them.**

### C-4 Lists paginate on the server, and pages are cached

- The server action takes `page` + `pageSize`, uses `.range()` and `count: "exact"`,
  and returns `{ rows, total, page, pageSize }` (`lib/server/paginate.ts`).
- **Page 1 is rendered by the Server Component.** First load costs zero client
  data requests.
- Page / filter / sort changes are F1, so TanStack Query handles them, keyed on
  every value that changes the result.
- Returning to an already-visited page issues **zero** requests.
- If a list needs no interactive paging, use `searchParams` and keep it fully
  server-rendered. Reach for TanStack Query only when a real navigation would be
  the wrong UX.

### C-5 Fetch only what renders

A table showing avatar, name, email, role, position, status selects exactly those
plus `id`. No joined relations. The full record loads **only when a row is
opened**, via a separate `getXDetail(id)` server action (F3), cached under
`[resource, "detail", id]`, so reopening costs nothing.

`lib/server/codev.service.ts` already does this correctly: `CODEV_LIST_COLUMNS`
(12 scalar columns, no joins) for lists, `getCodevDetail` wrapped in `cache()` for
one row. **This is the pattern to copy.**

---

## 2. Verified state

### 2.1 P0 — every filter on `/home/in-house` is dead (**measured**)

```
scripts/p10-filter-probe.mjs /home/in-house develop
  searchFound true · valueAfterTyping "develop" · inputAcceptedText true
  rowsBefore 50 · rowsAfter 50 · filterActuallyApplied FALSE · requestsTotal 0

scripts/p10-dropdown-probe.mjs /home/in-house
  optionPicked "TRAINING" · rowsBefore 50 · rowsAfter 50
  firstRowChanged false · requestsAfterPick 0
  verdict "FAIL: filter changed but NO server request was issued"
```

The user types or picks; nothing happens. No request, no row change. The table
silently shows **unfiltered** data.

**Root cause, confirmed in source.** `hooks/query/use-paginated-query.ts` sets
`staleTime: 60_000`. `app/home/in-house/_components/InHouseView.tsx` passes:

```ts
{ initialData: page === 1 ? initialData : undefined }
```

A filter change builds a new `queryKey`. TanStack creates the entry, is handed
`initialData`, and with no `initialDataUpdatedAt` treats it as fresh as of now.
Against `staleTime` it is not stale, so **`queryFn` never runs**, and the rendered
data is the server's unfiltered page 1. Every filtered key is seeded the same way,
so this is permanent, not a 60-second window.

`app/home/interns/_components/CodevContainer.tsx` contains the identical line.
**Both adopters are broken. Grep for the pattern before trusting any other route.**

### 2.2 Route inventory (**static** — `scripts/p10-inventory.mjs`)

23 route groups. `eff` is total `useEffect` in the subtree.

| Route | eff | Issues |
|---|---|---|
| `kanban` | 50 | 37 fetch-effects, undebounced search, 1 `select(*)` — **EXCLUDED, §3** |
| `settings` | 10 | unpaginated fetch, `page.tsx` awaits nothing, **7 `select(*)`** |
| `applicants` | 9 | unpaginated, undebounced search, **`page.tsx` awaits nothing** |
| `my-team` | 8 | undebounced search, 3 `select(*)` |
| `overflow` | 8 | unpaginated, undebounced search, 1 `select(*)` |
| `feeds` | 7 | clean |
| `projects` | 3 | unpaginated, **client slice** |
| `clients` | 2 | unpaginated, **client slice** |
| `tasks` | 1 | unpaginated, **client slice** |
| `admin-controls` | 1 | undebounced search, awaits nothing, 1 `select(*)` |
| `hire` | 1 | undebounced search |
| `promote-modal` | 1 | undebounced search |
| `surveys` | 1 | `page.tsx` awaits nothing |
| `in-house` | 0 | undebounced search, **no fetch skeleton**, filters dead (§2.1) |
| `interns` | 1 | filters dead (§2.1) |
| `certificate-preview` | 0 | **client `page.tsx`** |
| `orgchart`, `admin-dashboard`, `account-settings`, `ticket-support`, `time-tracker` | 0-2 | no pagination surface |
| `test-notifications`, `test-meeting-notification` | 0-1 | test routes shipped in the app |

`page.tsx awaits nothing` means the route fetches entirely client-side: a direct
C-1 violation.

### 2.3 Already fixed — do not redo

- Data-fetching effects: **84 → 3** non-kanban (`scripts/audit-effects.mjs`).
  The 3 are justified: notification polling (F4, has cleanup), an imperative modal
  open, and a test route.
- `experimental.staleTimes` configured; Router Cache **measured working**
  (`p8-navcache.mjs`: revisits return `rsc=0`).
- `force-dynamic`: 31 declarations → 4.
- `getCurrentCodev` selects an explicit column list.
- SurveyWidget resolved in `layout.tsx` and passed as a prop; **`/home` POSTs 3 → 1**.
- `revalidatePath` gaps: 14 files → 3, all remaining in `actions/kanban/*`.
- MUI removed; `loading.tsx` on 39/39 routes; layout streams sidebar + mobile nav.
- Modal registry is already `lazy()`; **0 dialogs idle / 1 after click**. Leave it.
- `lib/client/profile-points.ts`: 7 callers, 2 requests, 7 passing unit checks
  (`node --experimental-strip-types scripts/check-profile-points.mjs`).
- In-house pagination R1-R4 **measured passing** (`p9-table-probe.mjs`):
  `rule0DeltaOverHome 0 · rowsRendered 50 · payloadHasHeavyFields [] ·`
  `requestsReturningToPage1 0 · detailOnFirstOpen 1 · detailOnReopen 0`.

---

## 3. Exclusion — `/home/kanban`

Do not refactor `app/home/kanban/**`, `hooks/kanban/**`, `store/kanban-board/**`.
Its 50 effects and 37 fetch-effects are **out of scope**: it is the F2 case, a
heavy drag-and-drop surface where a server round trip per change is infeasible.

Kanban is a **regression target**. §4 changes shared hooks it may consume, so after
every section: open a board, drag a task between columns, open the task modal.

---

## 4. Fix the primitives first

No route work until these land. Every defect in §2.1 exists because a route was
able to express it.

### 4.1 `initialData` must travel with its key

Move the seeding decision **into** `hooks/query/use-paginated-query.ts`. Callers
pass the payload **and** the key it corresponds to; the hook seeds only on an
exact match:

```ts
usePaginatedQuery(queryKey, queryFn, { initialData, initialDataKey })
```

Seed only when `hashKey(queryKey) === hashKey(initialDataKey)` (TanStack exports
`hashKey`). Also pass `initialDataUpdatedAt`, otherwise the seed is treated as
fresh forever under `staleTime` — the second half of §2.1.

A route must not be able to supply `initialData` without declaring its key. Then
fix the two call sites (`InHouseView.tsx`, `CodevContainer.tsx`).

### 4.2 One key factory

`lib/shared/query-keys.ts` exists. Use it everywhere. List keys must include
**every** filter, sort and page value that changes the result; detail keys are
`[resource, "detail", id]`. A filter missing from the key produces the previous
filter's rows: the exact class of bug in §2.1.

### 4.3 One pagination contract

`lib/server/paginate.ts` (`Page<T>`, `PageArgs`) exists. Every paginated action
returns `Page<T>`. No route invents its own shape.

### 4.4 One debounce hook

`hooks/ui/use-debounced-value.ts` (~10 lines: `useState` + a timer effect with
cleanup). Text feeding a query key is debounced **before** it enters the key.
Target: a 7-character term produces **≤1** request. Every search box uses it; no
per-route debouncing.

### 4.5 One table skeleton

Render a skeleton whose row count equals `pageSize` and whose column widths match
the real columns. `app/home/in-house/_components/skeletons/InHouseTableSkeleton.tsx`
**already exists** — generalise it, do not write a second.

> ⚠️ With `placeholderData: keepPreviousData`, `isFetching` is true while the
> previous page is still on screen. Gating a skeleton on it **flashes over good
> data**. Gate on "nothing to show for this key". Verify by eye at 1600px and 900px.

### 4.6 Delete what you replace

When the last `usePagination` caller is gone, delete `hooks/data/use-pagination.ts`.
When the last `getCodevs` caller is gone, delete `getCodevs`. Do not leave both.

---

## 5. Route work

One route, then §6 in full, then commit. Never batch.

**Before editing any route, run `scripts/p10-dom.mjs <route>`** and read the real
control inventory. Selector assumptions have produced four false results in this
project (§7).

| # | Route | Work |
|---|---|---|
| 1 | `in-house` | §4.1 fix lands here. All of R1-R7 must pass. Reference for the rest. |
| 2 | `interns` | same `initialData` defect |
| 3 | `projects` | `await getProjects()` (whole table) → `getProjectsPage()`; delete the `usePagination` slice |
| 4 | `clients` | client slice → server page |
| 5 | `tasks` | client slice → server page |
| 6 | `applicants` | `page.tsx` awaits nothing: move fetching server-side, paginate, debounce search |
| 7 | `settings` | 7 `select(*)`, awaits nothing. Project columns; forms must still submit |
| 8 | `my-team` | 3 `select(*)`, undebounced search. Month navigation is F1 → keyed query, not deletion |
| 9 | `overflow` | already server-paginates; verify R5-R7 only, change nothing else |
| 10 | `admin-controls`, `hire`, `promote-modal`, `surveys` | debounce search; `awaits nothing` → server |
| 11 | `certificate-preview` | client `page.tsx` → server shell + client island |

### 5.1 Carry-over defects to fix as you pass through

- **`select("*")`: 45 remaining.** Fix on the hot paths you touch:
  `actions/settings/profile.ts` (6), `lib/server/codev-queries.ts` (2),
  `actions/feeds/post.ts` (2), `actions/overflow/actions.ts`. A `select("*")`
  feeding a **list** is worth fixing; one feeding a single displayed record is
  usually not. Report what you skipped.
- **`revalidatePath` missing** in `actions/kanban/columns.ts` (4 mutations),
  `drafts.ts` (5), `tasks.ts` (11). Kanban code is excluded from refactor, but a
  missing revalidate is a **cache-correctness** fix, not a refactor: add it.
- **TipTap SSR hydration.** `Tiptap Error: SSR has been detected, please set
  immediatelyRender explicitly to false` repeats on `/home/overflow`. Causes a
  hydration mismatch and a client re-render of that subtree. One-line fix per
  editor. TipTap also appears under kanban: fix it there too, it is a config flag,
  not a refactor.
- **Dead code**, delete after confirming zero importers:
  `app/home/(dashboard)/_components/DashboardProgressRoadmap.tsx` (310 lines, still
  fetches `/api/profile-points`), and `generateServicesPDF` in
  `settings/services/_components/ServicesPageClient.tsx` (~190 lines, no caller at
  baseline either; the preview button says "View Proposal" and routes to `/proposal`).
- **Test routes** `/home/test-notifications`, `/home/test-meeting-notification`
  are shipped in the app. Propose deletion; do not delete without approval.
- **5 typecheck errors in `.next/types/**`** — Next 15 made `params` a Promise on
  4 routes never updated. Pre-existing. Separate ticket.

---

## 6. Verification

### 6.1 The seven rules, per route

| | Rule | Probe |
|---|---|---|
| R1 | Page 1 server-rendered: 0 client data requests on load | `p9-table-probe` step 0 |
| R2 | Server returns one page, never the whole table | `p9-table-probe` rowsRendered |
| R3 | List selects only rendered columns; no joined relations | `p9-table-probe` payloadHasHeavyFields |
| R4 | Revisiting a cached page: 0 requests | `p9-table-probe` requestsReturningToPage1 |
| R5 | Every filter issues one request **and changes the rows** | `p10-filter-probe`, `p10-dropdown-probe` |
| R6 | Text input debounced: N chars → ≤1 request | `p10-filter-probe` requestsPerChar |
| R7 | Skeleton matching row layout while fetching | `p10-filter-probe` + visual |

R5-R7 did not exist in Phase 9. Their absence is why a route with zero working
filters was reported as passing.

### 6.2 Commands

```powershell
cd apps\codebility
$env:P10_BASE = "http://localhost:3000"

node scripts\p10-dom.mjs            <route>
node scripts\p9-table-probe.mjs     <route>            # R1-R4
node scripts\p10-filter-probe.mjs   <route> develop    # R5-R7
node scripts\p10-dropdown-probe.mjs <route>            # R5 on selects

node scripts\p10-inventory.mjs      # issue list must shrink
node scripts\p10-audit.mjs          # failing count must fall
node scripts\audit-effects.mjs      # dataFetchingEffects must not rise above 3
node ..\..\node_modules\typescript\bin\tsc --noEmit --pretty false   # source errors 0

node scripts\verify-home.mjs   "http://localhost:3000/home"
node scripts\verify-nav.mjs    "http://localhost:3000/home"
node scripts\verify-modals.mjs "http://localhost:3000/home/projects"
node scripts\p9-role-check.mjs                          # after ANY codev query change
```

Required: `filterActuallyApplied TRUE`, `requestsTotal` between 1 and 1,
`verdict "PASS: filter refetched and table changed"`, `pageErrors []`.

> `filterActuallyApplied false` with `requestsTotal 0` is the §2.1 signature. If
> you see it, the `initialData` seed is still wrong.

Invariants: `/home` 1 POST · tabs 9 · leaderboard rows 10 · sidebar 17 · nav 16 ·
modals 0 idle / 1 after click · page errors 0.

### 6.3 The build gate — not run since Phase 9 began

```powershell
# STOP THE DEV SERVER FIRST.
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility:build 2>&1 |
  Tee-Object -FilePath "$env:TEMP\p10-build.log"
Select-String -LiteralPath "$env:TEMP\p10-build.log" -Pattern "Dynamic server usage"
```

Expected **0 matches**. This is the only gate that catches a route which
prerenders, fails its Supabase call, and renders from an empty `?? []` fallback
while the build still reports success. That has already happened once, on
`settings/services`.

### 6.4 Checks no probe can make

- **Look at the screenshots.** Narrowed columns produce an error-free page with a
  blank name or missing avatar. `pageErrors: []` does not mean correct.
- **`role_id` after any `codev` query change.** `lib/server/codev-queries.ts`
  documents that querying without filtering by `role_id` makes RLS return
  **corrupted** values ("returns 1000 users, but only 5 have correct role_id").
  Run `p9-role-check.mjs`; it must report `allMatch: true`. A wrong `role_id`
  silently changes what a user may see.
- **Row count and ordering.** A `.range()` off-by-one drops one row per page.
  Compare total, and the first and last row of page 1, before and after.
- **Skeleton does not flash over live data** (§4.5), at 1600px and 900px.
- **Mutations refresh the list.** Edit a row, save: the query must be invalidated
  **and** the action must `revalidatePath`.
- **Forms still submit** (`settings`, `account-settings`, `announcements`).
- **Kanban** drag-and-drop, task modal, editor (§3).

### 6.5 Environment traps

- PowerShell execution policy blocks `pnpm.ps1`/`npx.ps1`. Always
  `node ...\pnpm\bin\pnpm.cjs <script>`.
- PowerShell breaks on `[` and `(` in paths. Use `-LiteralPath`.
  `git show <sha>:<path>` works only from the repo root with the full path.
- `next.config.mjs` sets `typescript.ignoreBuildErrors` and
  `eslint.ignoreDuringBuilds` to `true`. **A green build proves nothing about
  types.** Run `tsc --noEmit` separately.
- **Never build while the dev server runs.** It overwrites `.next`; the dev server
  then throws `TypeError: Cannot redefine property: __import_unsupported` from the
  edge middleware and 404s every route in 1-3 ms. Recovery: kill node dev
  processes, delete `apps/codebility/.next`, restart. This happened twice.
- `reactStrictMode: true` double-invokes effects in dev. Two calls ~0 ms apart are
  Strict Mode; ~500 ms apart are real.
- Playwright is global: import
  `file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs`,
  use `index.mjs`, pass `chromiumSandbox: true`. The logged-in profile is
  `%TEMP%\codebility-probe-profile`: **copy it**, never open it directly, and kill
  strays matching `codebility-.*-profile` before each run.
- Warm a route before timing it; the first hit pays a Turbopack cold compile of up
  to ~55 s.

---

## 7. Failure modes already hit here — do not repeat

| What happened | Rule |
|---|---|
| Declared in-house "passes every gate" from a probe that never touched filters | Unverified until R5-R7 run |
| `.first()` matched the **hidden mobile** search input; probe reported "no search box" | Match `:visible`; responsive layouts render both |
| A selector matched the navbar **notification bell** instead of a like button | Scope by icon class **and** `getBoundingClientRect().top > 250` |
| `svg.className` is an `SVGAnimatedString`, never a string | Use `getAttribute("class")` |
| Claimed "8 → 2 requests" by counting **call sites**; measured was 4 → 2 | Count requests, never call sites |
| Grepped `searchParams` in `page.tsx`, matched an unrelated param, declared projects paginated | Assert behaviour, not the presence of a token |
| Asserted "search fires per keystroke" from reading `onChange`; measured, it fired **zero** requests | Never infer causation from wiring |
| `.animate-pulse` counted decorative nodes; `/home` carries 3 permanently | Count blocks ≥24×120px against the route's settled baseline |
| Dynamic-imported `recharts`; Next had already split it, so it was a no-op | Keep a bundle change only if the build number moves |

**A number you did not observe is not a result.** If a probe cannot find its
target, that is a probe bug to fix, not a pass. **Never adjust a probe to make it
pass.**

---

## 8. Standards

- **Fix the primitive, not the call site.** If a route can express the bug, the
  primitive is wrong (§4).
- **Reuse before writing.** `paginate.ts`, `query-keys.ts`, `use-paginated-query.ts`,
  `InHouseTableSkeleton.tsx`, `RouteSkeletons.tsx`, `lib/client/profile-points.ts`
  exist. A second pagination helper or a per-route skeleton means it was done wrong.
- **Delete what you replace** (§4.6).
- **Comments only where code cannot speak**: a constraint (the RLS `role_id` trap),
  a deliberate ceiling, a non-obvious invariant. No narration, no restating the
  function name, no changelog comments. Repo baseline is 1-5% comment lines.
- **Match local style.** Read the file before editing it.

---

## 9. Order

| # | Work | Risk |
|---|---|---|
| 1 | §4 primitives | low, unblocks everything |
| 2 | `in-house` + `interns` (§2.1 P0) | medium, fixes broken filtering |
| 3 | `projects`, `clients`, `tasks` (client slices) | medium |
| 4 | `applicants`, `settings` (fetch entirely client-side) | medium |
| 5 | `my-team`, `overflow`, remaining search debounces | low |
| 6 | `certificate-preview`, §5.1 carry-overs | low |
| 7 | §6.3 build gate | must pass before "done" |

---

## 10. Reporting

1. Files changed, one line each.
2. **Probe JSON pasted verbatim** per route (`p9-table-probe`, `p10-filter-probe`,
   `p10-dropdown-probe`). Not a summary.
3. Every client fetch kept, with its F1-F4 justification.
4. Every server fetch added, and its C-2 cache tier.
5. `p10-inventory.mjs` and `p10-audit.mjs`: before → after.
6. `audit-effects.mjs` `dataFetchingEffects`: before → after (must stay ≤3).
7. Build log `Dynamic server usage` count.
8. What you did not do, and why.

Measurements are 3 runs as a range. Dev timings are Turbopack dev-mode; never
quote them as production numbers.

Phase 9 was reported complete while its flagship route had zero working filters.
Report what you measured, not what you expect.

# Phase 11 — Preview-build findings: broken route, duplicate fetches, prefetch storm, `select("*")`

**Repo:** `C:\Users\Programming\Desktop\Projects\Compile\Work\codebility-plus`
**App:** `apps/codebility`
**Branch:** `optimize/landing`
**Baseline:** `a7353477`
**Stack:** Next 15.3.7, React 19.1.0, TanStack Query 5, Zustand, Supabase

**Primary evidence: `docs/preview-audit-phase11.md` and
`apps/codebility/scripts/preview-routes-report.json`**, measured against the
deployed Vercel preview, authenticated as admin, across all 33 static `/home`
routes plus dynamic ones. Preview-build numbers supersede any dev-mode figure in
earlier phases.

Five workstreams, ordered by severity:

| | Workstream | Severity | Scope |
|---|---|---|---|
| **A** | `/home/time-tracker` is completely broken | **P0** | 1 line |
| **B** | Duplicate page-1 fetch on every paginated route | **P0** | 1 line in a shared hook |
| **C** | Pagination gives no feedback (page number + skeleton) | P1 | hook + 6 routes |
| **D** | Hydration errors: React #419 and #418 | P1 | 2 routes |
| **E** | 36 multi-row `select("*")` | P2 | ~19 files |

Prefetch volume (F3) and per-request middleware cost are **deliberately excluded**;
see §7.

---

## 0. Ground rules

- **Server Components fetch; Server Actions mutate.** Client fetching only for
  interaction-driven data (page/filter/sort), per-interaction detail, or realtime.
- **No new `useEffect` for data.** Non-kanban data-fetching effects currently
  number **3**, all justified. Verify with `scripts/audit-effects.mjs`; it must
  not rise.
- **`/home/kanban/**` is excluded** from refactor and is a regression target:
  after each workstream, open a board, drag a task, open the task modal.
- **Fix the primitive, not the call site.** B and C are both single points that
  six routes inherit.
- **Reuse before writing.** `use-paginated-query.ts`, `paginate.ts`,
  `query-keys.ts`, `InHouseTableSkeleton.tsx`, `RouteSkeletons.tsx` exist.
- **Comments only where code cannot speak.** No narration, no changelog comments.
  Repo baseline is 1-5% comment lines.

### 0.1 What the preview proved is already working — do not "fix" these

- **The Router Cache works.** A revisit to an already-visited route cost **1**
  request (`site.webmanifest`). `staleTimes: 3600` is doing its job. An earlier
  reading that the cache was being wiped was a misread of prefetch traffic.
- **Filters work.** `p10-filter-discriminate.mjs` on `/home/in-house`: MENTOR
  returns 8 rows, TRAINING returns 10, distinct sets. An earlier "filters are
  dead" verdict came from comparing a filter against the *unfiltered* list, whose
  top rows were legitimately identical.
- **Search is debounced.** 7 characters produce 1 request.
- **`/home/tasks` does not redirect** to `/home/applicants`, and
  `/home/test-meeting-notification` does not redirect to `/home`. Both were
  overlapping navigations in a bulk probe.
- **`orgchart`, `settings`, `settings/surveys`, `admin-controls/ticket-support`**
  render real data. A "low content" flag was counting `tbody tr` on card layouts.

---

## 1. Workstream A (P0) — `/home/time-tracker` server render error

The route renders its error boundary, not the page:

```
⏱️ Unable to load time logs
We couldn't retrieve your time tracking data.
```

`firstContentMs: 17753`, then it fails. Three console errors, including
`An error occurred in the Server Components render`.

**Root cause.** `app/home/time-tracker/page.tsx:34`

```ts
.from("codev")
.select(`start_time, end_time, time_log (...)`)
.eq("user_id", user?.id)     // no such column on `codev`
.single();
```

`codev` keys on `id`. Every other `codev` query in the app filters `.eq("id", ...)`.
PostgREST rejects the unknown column and the server render throws.

**Fix.** `.eq("user_id", user?.id)` → `.eq("id", user?.id)`.

**Verify.** Load the route: the page renders time logs, zero console errors. Then
confirm the columns selected actually exist on `codev` — if `start_time` /
`end_time` are also wrong, this fix will surface a second PostgREST error rather
than fully working. Do not stop at "the boundary is gone".

---

## 2. Workstream B (P0) — the duplicate page-1 fetch

### 2.1 Evidence

`preview-dupfetch.mjs`, hard load then 16 s idle, nobody touching the page.
**6 of 6** paginated routes re-fetch page 1 after the server already rendered it:

| Route | duplicate page-1 fetch | fires after | payload |
|---|---|---|---|
| `/home/in-house` | 1 | 2.7 s | `{page:1, pageSize:10, filters:{...}}` |
| `/home/interns` | 1 | 10.0 s | `{page:1, pageSize:30, ...}` |
| `/home/projects` | 1 | 5.9 s | `{page:1, pageSize:12, ...}` |
| `/home/clients` | 1 | 4.2 s | `{page:1, pageSize:12}` |
| `/home/tasks` | **5** | 2.8 s | `{codevId:..., page:1, pageSize:9}` |
| `/home/applicants` | 1 | 3.4 s | `{status:"applying", page:1, ...}` |

Idle trace on `/home/clients`:

```
7.2s   hydration
7.3s   ACTION /home/clients  body "[]"                        <- layout action, benign
11.3s  ACTION /home/clients  body [{"page":1,"pageSize":12}]  <- THE DUPLICATE
```

### 2.2 Root cause

`hooks/query/use-paginated-query.ts:37`

```ts
...(seeded ? { initialData, initialDataUpdatedAt: 0 } : {})
```

`initialDataUpdatedAt: 0` marks the seed **immediately stale**, so TanStack
discards the server's page 1 and re-requests it.

That `0` was deliberate: it is what makes a **filter change** refetch, which fixed
the dead-filter bug in Phase 10. One value is serving two cases.

### 2.3 Fix

The two cases must be separated. The seeded key is *already fresh* because the
server just rendered it; every other key has no seed at all and fetches normally.

`initialDataUpdatedAt` must be **now** for the matching key, not `0`:

```ts
...(seeded ? { initialData, initialDataUpdatedAt: seededAt } : {})
```

where `seededAt` is the time the server payload was produced. `Date.now()`
evaluated during render is acceptable; better is a timestamp carried on the
server payload, so a slow hydration does not extend the freshness window.

> ⚠️ **Do this before workstream C.** While B is live, a page-1 refetch fires on
> every load, so any skeleton gated on fetch state will flash on every load.
> Fixing C first would look correct and mask B.

### 2.4 Verify

`preview-dupfetch.mjs` must report **0** duplicate page-1 fetches on all six
routes, and filters must still refetch:

```powershell
node scripts\preview-dupfetch.mjs                  # 0 duplicates, 6/6 routes
node scripts\p10-filter-discriminate.mjs "/home/in-house"   # must stay PASS
```

Both are required. B and the Phase 10 filter fix pull in opposite directions, so
proving one without the other is meaningless.

`/home/tasks` fires **5** duplicates and **7** total actions, the worst on the
site. If it still differs after the hook fix, it has its own bug: investigate
separately.

---

## 3. Workstream C (P1) — pagination gives no feedback

### 3.1 Two root causes, both confirmed locally

**C1. The page number waits for the server.**
`app/home/in-house/_components/InHouseView.tsx:186`

```ts
currentPage: data?.page ?? page,
```

The control renders the server-echoed page, not local state. Same line in
`app/home/interns/_components/CodevContainer.tsx:185`.

**C2. The skeleton never shows on a page change.**
`InHouseView.tsx:87` destructures `isPending`; `:166` gates the skeleton on it.
The hook sets `placeholderData: keepPreviousData`, which keeps the previous rows,
so `isPending` stays **false** during a page change. The skeleton only fires when
there is no data for the key at all.

Net effect: click a page, the number does not move, rows do not change, no
skeleton. The click looks dead.

Same `isPending ?` gate in `applicants/_components/applicantLists.tsx:84`,
`clients/_components/ClientsCard.tsx:114`,
`projects/_components/ProjectCardContainer.tsx:93`,
`tasks/_components/TasksContainer.tsx:60`.

### 3.2 Fix in the hook

`usePaginatedQuery` returns raw `useQuery` output, so every caller had to pick a
flag and all five picked the same wrong one. Return one derived boolean instead:

| State | Meaning | UI |
|---|---|---|
| no data for this key | cold load | skeleton |
| `isPlaceholderData` | showing a **previous** key's rows | skeleton (visible rows are wrong for the request) |
| background refetch, same key | on-screen data is correct | no skeleton |

Expose `showSkeleton` = `isPending || isPlaceholderData`. Routes render
`showSkeleton ? <Skeleton/> : <Table/>` and never touch TanStack flags.

> Do **not** gate on bare `isFetching`: it is true during same-key background
> refetches and would flash a skeleton over correct data.

### 3.3 Optimistic page number

```ts
currentPage: page,
```

`totalPages` still derives from `data.total` / `data.pageSize`, which is correct:
the total only changes when a filter changes. Keep the boundary guard at
`InHouseTable.tsx:267` so an optimistic number cannot exceed `totalPages`.

### 3.4 Skeleton must match the layout

`InHouseTableSkeleton` takes a `rows` prop. Requirements:

- row count equals the **requested** `pageSize`, not the previous page's row count
  (the last page is short; reusing it makes the skeleton jump)
- column widths match the real table, so nothing shifts when data lands
- verify at 1600px and 900px

For `projects`, `clients`, `tasks` (card grids), reuse `CardsSkeleton` from
`app/home/_components/skeletons/RouteSkeletons.tsx`. Write no new skeletons.

### 3.5 Acceptance — the probe exists and currently FAILS

`scripts/p11-pagination-probe.mjs` is written. Do not rewrite it. It delays the
list action 2.5 s via `page.route` so the UI can be sampled **mid-flight**;
without that the response lands too fast to distinguish an optimistic update from
a server-driven one.

Recorded baseline on `/home/in-house` (this is the bug):

```json
"before":   { "activePage": "1" },
"inflight": { "activePage": "1", "skeletonBlocks": 0, "requestFired": true },
"settled":  { "activePage": "2", "skeletonBlocks": 0 },
"requestsGoingBack": 0,
"verdict": ["FAIL C-1 page number updates before the response",
            "FAIL C-2 skeleton visible during the change"]
```

During the entire 2.5 s flight the marker still reads **"1"** with **0** skeleton
blocks. Rows do change once settled and `requestsGoingBack: 0`, so pagination and
the cache work; only the feedback is missing.

**Workstream C is done when this prints `"verdict": []`** for
`/home/in-house` and `/home/interns`.

Two selector facts, both of which caused false failures before being fixed:

- **`aria-current="page"` also matches the sidebar nav link.** The first version
  reported `activePage: "In-House"`. Restrict to the main column
  (`getBoundingClientRect().left > 240`) and numeric text.
- **This pagination has no "Next" button** — numeric buttons only (`1 2 3 4 … 14`).
  A `:has-text("Next")` locator matches nothing and the click silently no-ops,
  which is indistinguishable from a broken app. Target the button for
  `currentPage + 1`.

Not yet asserted, add them: skeleton row count equals `pageSize`; on the last page
advancing does not increment.

---

## 4. Workstream D (P1) — hydration errors

| Route | Error | Note |
|---|---|---|
| `/home/my-team/1a053d2d-…` | `Minified React error #419` | also renders a stuck "Loading member statis…" |
| `/home/my-team/e2e1a591-…` | `Minified React error #419` | |
| `/home/tasks` | `Minified React error #418` | text-content hydration mismatch |

Both `/home/my-team/<project>/leaderboard` sub-routes are clean.

**#419** is a Suspense/hydration boundary error, **#418** a text mismatch. Typical
causes here: a value that differs between server and client render (`Date.now()`,
`toLocaleString`, `Math.random()`), or a `Suspense` boundary whose content resolves
differently on the client.

Reproduce in **dev**, not preview: dev gives the unminified message naming the
component and the mismatched text. Then fix the non-deterministic value.

The stuck "Loading member statis…" on the first project suggests a Suspense
fallback that never resolves. Check whether the #419 and the stuck fallback share
a cause before treating them as two bugs.

---

## 5. Workstream E (P2) — multi-row `select("*")`

### 5.1 Distribution (`scripts/p11-select-audit.mjs`)

**93** occurrences:

| Kind | Count | Action |
|---|---|---|
| `single` / `maybeSingle` / `limit(1)` | 42 | **out of scope** — one row, fields generally all rendered |
| `head: true` counts | 15 | **out of scope** — transfers no rows |
| **MULTI** | **36** | **in scope** — cost multiplies by row count |

### 5.2 The 36, by file

| File | Table:line |
|---|---|
| `app/home/settings/profile/page.tsx` | education:77, work_experience:82, work_schedules:85, job_status:86 |
| `actions/my-team/attendance-warnings.ts` | attendance:106, notifications:158, attendance:266 |
| `actions/settings/surveys.ts` | surveys:244, surveys:284, survey_questions:458 |
| `app/home/my-team/AddMembersModal.tsx` | codev:391, codev:453, codev:503 |
| `lib/server/codev-queries.ts` | codev:12, codev:18 (excluded, §5.4) |
| `actions/promote-modal/actions.ts` | feature_modals:14, feature_modals:32 |
| `actions/settings/news-banners.ts` | news_banners:242, news_banners:282 |
| `actions/applicants/queries.ts` | codev:68 |
| `actions/my-team/*` | attendance-sync:14, leaderboard:131, project:285 |
| `lib/my-team/attendance-service.ts` | attendance:81 |
| `lib/server/notification.service.ts` | notifications:50 |
| `actions/overflow/actions.ts` | overflow_comments:648 |
| `actions/settings/survey-questions.ts` | survey_questions:182 |
| `actions/admin/client-tracker.ts` | client_outreach:209 |
| `actions/applicant-onboarding/actions.ts` | onboarding_videos:12 |
| `app/api/attendance/route.ts` | attendance:22 |
| `app/api/job-applications/route.ts` | job_applications:59 |
| `app/api/profile-points/[codevId]/route.ts` | profile_points:91 |
| `app/home/admin-controls/appointments/page.tsx` | appointments:42 |

Re-run the audit for the authoritative list.

### 5.3 Method, per query

1. Find the consumer: the calling function, then the component rendering it.
2. List the fields actually rendered **or branched on** — include fields used in
   sorts, filters and conditionals, not just those printed.
3. Replace `"*"` with that list. Keep `id` and any key the code joins or maps on.
4. If a row feeds both a list and a detail view, split it: narrow list query plus
   `getXDetail(id)`. `lib/server/codev.service.ts` (`CODEV_LIST_COLUMNS` +
   `getCodevDetail`) is the reference.
5. Narrow the TypeScript row type too. **Do not cast.** A cast yields runtime
   `undefined` on a dropped field and the page renders blank instead of throwing.

Priority: `codev` queries → `attendance` → `notifications` → the rest.

### 5.4 Explicit exclusions

- **`lib/server/codev-queries.ts:12,18`** — `"*"` is a **default parameter** that
  callers override (`fetchMentors(selectFields)`). Narrowing the default changes
  behaviour for every caller. Narrow the callers instead, if anything.
- **`head: true` count queries** (15) and **`single()` queries** (42).
- **`settings/profile`'s own-record reads** — one user's own data feeding six edit
  forms that need nearly every column. The four **list** queries on that page
  (education, work_experience, work_schedules, job_status) **are** in scope.

### 5.5 The RLS landmine

`lib/server/codev-queries.ts` documents that querying `codev` **without filtering
by `role_id`** makes Supabase RLS return **corrupted `role_id`** values ("returns
1000 users, but only 5 have correct role_id").

Any `codev` query change — `AddMembersModal.tsx` (3), `actions/applicants/queries.ts`,
`codev.service.ts` — must be followed by `node scripts/p9-role-check.mjs`
reporting `allMatch: true`. A wrong `role_id` silently changes what a user may see.

### 5.6 Row parity — no probe covers this yet

Narrowing a `select` can drop a row, **reorder** results (a column removed that
the sort or a `.contains()` depends on), or blank a cell. None of those throw.

Write `scripts/p11-row-parity.mjs`: capture, for a route, the full visible row text
of page 1 **and** page 2 plus the reported total, to JSON. Run before, change, run
after, diff. Required: identical text, order and total.

```powershell
node scripts\p11-row-parity.mjs "/home/in-house" before.json
# change
node scripts\p11-row-parity.mjs "/home/in-house" after.json
# diff must be empty
```

---

## 6. Verification

### 6.1 Per workstream

```powershell
cd apps\codebility
$env:P10_BASE = "http://localhost:3000"

# A
# load /home/time-tracker, expect real content and 0 console errors

# B
node scripts\preview-dupfetch.mjs                            # 0 duplicates, 6/6
node scripts\p10-filter-discriminate.mjs "/home/in-house"    # must stay PASS

# C
node scripts\p11-pagination-probe.mjs "/home/in-house"       # verdict []
node scripts\p11-pagination-probe.mjs "/home/interns"        # verdict []

# E
node scripts\p11-select-audit.mjs                            # MULTI count falls
node scripts\p9-role-check.mjs                               # allMatch true
node scripts\p11-row-parity.mjs <route> after.json           # diff empty

# always
node scripts\audit-effects.mjs                               # dataFetchingEffects <= 3
node ..\..\node_modules\typescript\bin\tsc --noEmit --pretty false   # source errors 0
node scripts\verify-home.mjs   "http://localhost:3000/home"
node scripts\verify-nav.mjs    "http://localhost:3000/home"
node scripts\verify-modals.mjs "http://localhost:3000/home/projects"
```

Invariants: `/home` 1 POST · tabs 9 · leaderboard rows 10 · sidebar 17 · nav 16 ·
modals 0 idle / 1 after click · page errors 0.

### 6.2 Production build gate

```powershell
# STOP THE DEV SERVER FIRST. Building over a live dev server corrupts .next; the
# edge middleware then 404s every route in 1-3 ms. Recovery: kill node dev
# processes, delete apps/codebility/.next, restart.
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility:build 2>&1 |
  Tee-Object -FilePath "$env:TEMP\p11-build.log"
Select-String -LiteralPath "$env:TEMP\p11-build.log" -Pattern "Dynamic server usage"
```

Expected **0 matches**. Only this catches a route that prerenders, fails its
Supabase call, and renders from an empty `?? []` fallback while the build reports
success. It has happened once already.

### 6.3 Re-measure on the preview, not dev

A, B and D were all found on the preview build and some are invisible in dev.
After the work, re-run against a fresh preview deploy:

```powershell
node scripts\preview-all-routes.mjs      # writes preview-routes-report.json
node scripts\preview-dupfetch.mjs
node scripts\preview-dynamic.mjs         # #419 on my-team/<project>
```

Compare against the committed `preview-routes-report.json`. Required deltas:
`duplicatePage1Fetches` 6 routes → 0; `/home/time-tracker` from server error to
rendered; `pageErrors` on `/home/tasks` and `/home/my-team/<id>` → empty.

### 6.4 Timing: read `firstContentMs`, not `ms`

`preview-routes-report.json` carries both. `ms` is time-to-**settle** and includes
the probe's idle wait, which is why all 33 routes cluster at 45-53 s. That is a
probe artifact, not a user-facing load time.

The real figure is `firstContentMs`: **min 2733, max 17753, avg 4842**. Use it.

Worst offenders worth watching as you work:

| Route | firstContentMs |
|---|---|
| `/home/time-tracker` | 17753 (then fails) |
| `/home/admin-controls/appointments` | 10337 |
| `/home/admin-controls/client-tracker` | 9970 |
| `/home/settings/profile` | 5830 |

Fixing A should remove the 17.8 s outlier. Fixing B should cut one full server
round trip from each of the six paginated routes. Neither is expected to move the
~4.8 s floor; that is §7.

### 6.5 Environment traps

- Invoke pnpm as `node ...\pnpm\bin\pnpm.cjs <script>`; the execution policy
  blocks `pnpm.ps1`.
- Use `-LiteralPath` in PowerShell; `[` and `(` in route paths break globbing.
- `next.config.mjs` sets `ignoreBuildErrors` and `ignoreDuringBuilds`. **A green
  build proves nothing about types.** The 5 errors in `.next/types/**` are
  pre-existing; source errors must be 0.
- `reactStrictMode: true` double-invokes effects in dev. Two calls ~0 ms apart are
  Strict Mode; ~500 ms apart are real.
- Playwright is global:
  `file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs`,
  `index.mjs`, `chromiumSandbox: true`. **Copy** `%TEMP%\codebility-probe-profile`
  rather than opening it; kill strays matching `codebility-.*-profile` first.
- Warm a route before timing in dev; the first hit pays a cold compile of up to ~55 s.

---

## 7. Deliberately out of scope — prefetch and middleware cost

The preview recorded **607 RSC prefetches across 33 loads**, 11-19 per route, and
**86** on `/home/tasks` alone. Each is a full server render through
`middleware.ts`, which per request runs `auth.getUser()`, a `codev` select and a
`roles` select. `/home` has 16 sidebar links and prefetches 11 on load.

This is almost certainly the ~4.8 s floor, and it is the largest remaining win.
It is excluded here because:

- the fix is `prefetch={false}` on sidebar links, or narrowing the middleware
  matcher, both of which change navigation feel site-wide
- middleware touches **authentication**. Supabase deliberately recommends
  `getUser()` over `getSession()` there because it revalidates the token
  server-side. **Do not swap it to chase latency.**

It needs its own plan and a security review. Do not start it as part of Phase 11.

---

## 8. Order

| # | Work | Risk |
|---|---|---|
| 1 | **A** time-tracker one-line column fix | low, restores a dead route |
| 2 | **B** `initialDataUpdatedAt` seed freshness | low, but must be verified with the filter probe |
| 3 | **C** hook `showSkeleton` + optimistic page, on in-house then the other 5 | low |
| 4 | **D** #419 / #418, reproduced in dev for real messages | medium |
| 5 | **E** `codev` multi-row selects, then attendance/notifications, then the rest | ⚠️ RLS |
| 6 | §6.2 build gate, §6.3 fresh preview re-measure | must pass |

B before C: while B is live a page-1 refetch fires on every load, so any
fetch-gated skeleton flashes on every load and C would look correct while masking B.

---

## 9. Assertion discipline

Every row below is a real false result from this project.

| What happened | Rule |
|---|---|
| Reported `ms` 45-53 s as load time; it was time-to-settle including an idle wait | Read `firstContentMs` |
| Compared a filtered list against the **unfiltered** list; top rows were legitimately identical, so a working filter was called broken | Compare **two different filter values** |
| Asserted "search fires per keystroke" from reading `onChange`; measured, it fired **zero** requests | Never infer behaviour from wiring |
| Counted any server-action POST as the list refetch; the layout action and notification polling also POST | Match the action id or inspect the POST body |
| Reported the Router Cache was being wiped; a revisit measured **1** request | Measure the revisit directly |
| `.first()` matched the **hidden mobile** search input | Match `:visible` |
| `aria-current="page"` matched the **sidebar nav link** | Scope to the main column |
| A selector matched the navbar **notification bell** | Scope by icon class and vertical position |
| `svg.className` is an `SVGAnimatedString` | `getAttribute("class")` |
| Claimed "8 → 2 requests" from counting **call sites**; measured 4 → 2 | Count requests, never call sites |
| Grepped a token in `page.tsx` and declared a route paginated | Assert behaviour, not tokens |
| Bulk probe showed `/home/tasks` redirecting; a clean load showed it does not | Confirm on an isolated load |

**A number you did not observe is not a result.** If a probe cannot find its
target, that is a probe bug. **Never weaken a probe to make it pass.**

---

## 10. Reporting

1. Files changed, one line each.
2. **A:** the route rendering, with console errors listed (expect none).
3. **B:** `preview-dupfetch.mjs` before → after, **and** the filter probe still
   passing.
4. **C:** `p11-pagination-probe.mjs` JSON showing `verdict: []`.
5. **D:** the unminified dev error and the non-deterministic value you removed.
6. **E:** `p11-select-audit.mjs` MULTI before → after; per query, the fields kept
   and why; `p9-role-check.mjs`; row-parity diffs.
7. `audit-effects.mjs` `dataFetchingEffects` before → after (≤3).
8. Build log `Dynamic server usage` count.
9. Fresh-preview deltas per §6.3.
10. Every `select("*")` deliberately left, with the reason.
11. What you did not do, and why.

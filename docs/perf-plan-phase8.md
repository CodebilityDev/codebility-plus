# /home Phase 8 — Caching, Over-fetching, and Deferred Mounting

**Repo:** `C:\Users\Programming\Desktop\Projects\Compile\Work\codebility-plus`
**App:** `apps/codebility`
**Branch:** `optimize/landing`
**Baseline commit:** `38002e26`
**Stack:** Next **15.3.7** (App Router, Turbopack), React **19.1.0**, TanStack Query 5, Zustand, Supabase

This is an execution spec. Every problem below is backed by a measurement or a
file:line citation taken from the current tree. Follow it top to bottom.

---

## 0. Read this first

### 0.1 Scope

Three problems, in priority order:

1. **P1 — Revisiting a page re-runs its skeleton.** The Next.js Router Cache is
   effectively disabled, so every client navigation refetches the RSC payload.
2. **P2 — Over-fetching.** 50 `select("*")` calls; the worst runs on every
   authenticated request. Plus two always-on client fetches nobody asked for.
3. **P3 — Always-mounted components.** Chrome-level components mount and fetch
   the moment a user logs in, regardless of whether they are needed.

### 0.2 Hard exclusion — `/home/kanban/**`

Do **not** refactor, convert, or lazy-load anything under:
`app/home/kanban/**`, `hooks/kanban/**`, `store/kanban-board/**`.

P1 changes global config that kanban inherits. Kanban is a **regression target**:
verify it still works, never edit it.

### 0.3 Standing rule — no new `useEffect`

Do not introduce a `useEffect`. If you remove one, do not replace it with
another. Legitimate effects synchronise with something *outside* React (DOM
event listeners, observers, timers, Supabase realtime channels) and must have a
cleanup. Anything that fetches, derives state, or syncs React-to-React state is
the wrong tool — use a Server Component, a `key` prop, `useDeferredValue`, or
compute during render.

If you believe an effect is genuinely unavoidable, **stop and say so in your
report with the reasoning** rather than adding it silently.

### 0.4 Environment (verified on this machine)

```powershell
# Typecheck — the ONLY reliable type gate. Run from apps/codebility.
node ..\..\node_modules\typescript\bin\tsc --noEmit --pretty false

# Dev server (from repo root)
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility

# Production build (from repo root)
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility:build
```

Traps that will cost you time:

- **PowerShell execution policy blocks `pnpm.ps1` / `npx.ps1`.** Always invoke
  through `node ...pnpm.cjs`.
- **PowerShell breaks on `[` and `(` in paths** (dynamic routes, route groups).
  Use `-LiteralPath` with `Test-Path`, `Get-Content`, `Select-String`.
  `git show <sha>:<path>` works fine — but only from the **repo root** with the
  full `apps/codebility/...` path.
- **`next.config.mjs` sets `typescript.ignoreBuildErrors: true` and
  `eslint.ignoreDuringBuilds: true`.** A green build proves nothing about types.
  Always run `tsc --noEmit` separately.
- **`tsc --noEmit` reports 5 pre-existing errors**, all in `.next/types/**`
  (Next 15 made `params` a Promise on 4 routes that were never updated). They
  are not yours. Filter them: `Where-Object { $_.Line -notmatch '^\.next[/\\]types' }`.
  Source errors must be **0**.
- **Never run `codebility:build` while the dev server is running.** The build
  overwrites `.next` and the dev server starts serving 500s with
  `ENOENT ... build-manifest.json`. Stop the dev server first, build, then
  restart it.
- **`reactStrictMode: true`** — dev double-invokes effects. A duplicated request
  in dev is often Strict Mode, not a bug. Two calls ~0 ms apart = Strict Mode;
  ~500 ms+ apart = real.

### 0.5 Playwright (installed globally, not in the repo)

```js
const { chromium } = await import(
  "file:///C:/Users/Programming/AppData/Roaming/npm/node_modules/playwright/index.mjs"
);
```

- Import by **absolute path**; a bare `"playwright"` specifier fails.
- Use **`index.mjs`** (`index.js` is CommonJS, no named exports).
- Pass **`chromiumSandbox: true`** or Chrome shows an "unsupported
  command-line flag" banner.
- The logged-in session lives in `%TEMP%\codebility-probe-profile`. **Copy it,
  do not use it directly** — only one process may hold a profile:
  ```js
  const SHARED = path.join(os.tmpdir(), "codebility-probe-profile");
  const PROFILE = path.join(os.tmpdir(), "codebility-<yourname>-profile");
  if (!fs.existsSync(PROFILE)) fs.cpSync(SHARED, PROFILE, { recursive: true });
  ```
  Kill strays before each run:
  ```powershell
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
    Where-Object { $_.CommandLine -match "codebility-.*-profile" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  ```

**Two selector traps that silently produce false passes** (both hit during the
previous phase):

- On an `<svg>`, `className` is an `SVGAnimatedString`, **not** a string. Use
  `el.getAttribute("class")`.
- "A button containing an svg and a numeric label" also matches the **navbar
  notification bell**. Scope like-buttons by icon class and
  `getBoundingClientRect().top > 250`.

### 0.6 Existing probe scripts — reuse, do not rebuild

In `apps/codebility/scripts/`:

| Script | Purpose |
|---|---|
| `suite.mjs` | Full route + interaction + timing suite (the main gate) |
| `interactions.mjs` | Feeds drawer, overflow like, contact save |
| `count-points.mjs` | Counts `/api/profile-points` requests per load |
| `probe-actions.mjs <route>` | Server-action POSTs grouped by action id |
| `route-inventory.mjs` | Routes, `loading.tsx` coverage, client pages |
| `verify-home.mjs`, `verify-nav.mjs`, `verify-modals.mjs`, `verify-leaderboard.mjs` | Canonical invariants |
| `rsc-probe.mjs` | RSC navigation TTFB |

All dev timings are Turbopack dev-mode. **Run 3× and report a range.** Never
quote them as production numbers. The first hit to a route pays a cold compile
(up to ~55 s); always warm the route, then measure.

---

## 1. What is already done — do NOT redo

Phases 1–7 are committed (`0691c0e0` … `38002e26`). Read the diff, don't trust
prose: `git log --oneline 5746a8ac..HEAD`.

- **MUI fully removed** (dead `DashboardRoadmap` + style root + theme). 0 MUI
  symbols in the client bundle.
- **`loading.tsx` on 39/39 in-scope routes** (baseline 17). Shared skeletons in
  `app/home/_components/skeletons/RouteSkeletons.tsx`.
- **Layout streams**: `app/home/layout.tsx` awaits only `getCurrentCodev()`;
  the sidebar + mobile nav share one un-awaited `getSidebarData` promise across
  two `<Suspense>` boundaries.
- **Server-Component data fetching** on feeds, overflow, settings/services.
  Mount-fetch effects deleted; `useDeferredValue` replaced a debounce; a `key`
  prop replaced a state-reset effect.
- **N+1s removed**: `countUpvotes` per feed card, `checkPostLike` per question
  card, `getTeamLead`+`getMembers` re-fetch in `ChecklistStatusBanner`.
- **`lib/client/profile-points.ts`** — shared in-flight+cache for
  `/api/profile-points`. 7 call sites, 2 requests per load. Has 7 passing unit
  checks: `node --experimental-strip-types scripts/check-profile-points.mjs`.
- **Modal registry is already lazy** — `components/providers/modal-provider-home.tsx`
  uses `lazy(() => import(...))`. Verified **0 dialogs mounted at idle, 1 after
  click**. Do not "fix" this again; see §4.1 for what actually remains.

Measured current state (all verified under Playwright at `38002e26`):

| Route | server-action POSTs | notes |
|---|---|---|
| `/home` | 3 | survey ×2 + notifications — all legitimate |
| `/home/feeds` | ~9 | mostly Strict-Mode-doubled `hasUserUpvoted` |
| `/home/overflow` | 4 | |
| `/home/settings/services` | 3 | layout only, 0 route-specific |
| `/home/settings/profile` | 4 | + 2 `/api/profile-points` |
| `/home/my-team/[projectId]` | ~11 | + 9 `/api/codev/*/points` |

---

## 2. P1 — Revisiting a page re-runs its skeleton

### 2.1 Root cause

**`apps/codebility/next.config.mjs` has no `experimental.staleTimes`.** Its
`experimental` block (L54–58) contains only `serverActions.bodySizeLimit`.

Next.js 15 changed the **client Router Cache** default for dynamic segments from
30 s to **0 s**. With 0, the router keeps no RSC payload between navigations, so
going Home → Feeds → Home refetches `/home` from the server and re-triggers its
`loading.tsx`. This is precisely the symptom: *"it keeps loading data again
because it shows skeleton loaders even if I've been on that page before."*

Phase 3 added `loading.tsx` to all 39 routes, which made this **much more
visible** — previously the page just froze; now it visibly flashes a skeleton.
The skeletons are correct; the caching is not.

**Aggravating factor:** 21 of 43 page files under `app/home` declare
`export const dynamic = "force-dynamic"` and/or `export const revalidate = 0`.
Full list is in §2.4. Most are cargo-culted: a route that reads `cookies()` (via
the Supabase server client) is *already* dynamic, so the directive adds nothing
except opting out of every caching layer.

### 2.2 Step 1 — enable the Router Cache

**File: `apps/codebility/next.config.mjs`**

Extend the existing `experimental` block (do not replace it — `serverActions`
must stay):

```js
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
    // Next 15 defaults the client Router Cache for dynamic segments to 0s, so
    // every client-side navigation refetched the RSC payload and re-fired the
    // route's loading.tsx. 30s restores the pre-15 behaviour: returning to a
    // page you just visited is instant and shows no skeleton.
    // Mutations must call revalidatePath/revalidateTag (see §2.3) so this
    // window never serves data the user just changed.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
```

### 2.3 Step 2 — make mutations invalidate the cache

A 30 s stale window is only safe if writes push fresh data. **Every server
action that mutates data must call `revalidatePath` (or `revalidateTag`) for the
route it affects.**

Audit with:

```powershell
cd apps\codebility
Get-ChildItem -LiteralPath "actions" -Recurse -File -Include *.ts |
  Select-String -Pattern "revalidatePath|revalidateTag" |
  Group-Object Path | ForEach-Object { "{0}: {1}" -f (Split-Path $_.Name -Leaf), $_.Count }
```

For each mutating action **without** a revalidate call, add one for its route.
Minimum set to fix (these back UI the user changes and then immediately looks at):

| Action file | Revalidate |
|---|---|
| `actions/settings/profile.ts` | `revalidatePath("/home/settings/profile")` |
| `actions/feeds/post.ts` (create/edit/delete/upvote) | `revalidatePath("/home/feeds")` |
| `actions/overflow/actions.ts` (post/comment/like) | `revalidatePath("/home/overflow")` |
| `actions/my-team/project.ts` | `revalidatePath("/home/my-team")` |
| `actions/projects/actions.ts` | `revalidatePath("/home/projects")` |

For a client component that mutates and must see the result immediately, call
`router.refresh()` after the action resolves. Do **not** add an effect for this;
call it in the submit handler.

### 2.4 Step 3 — remove cargo-culted `force-dynamic`

These 21 files currently opt out of caching. **For each, delete
`export const dynamic = "force-dynamic"` and `export const revalidate = 0`
unless the route genuinely needs per-request freshness.**

```
app/home/account-settings/page.tsx            app/home/my-team/[projectId]/page.tsx
app/home/admin-controls/page.tsx              app/home/my-team/[projectId]/leaderboard/page.tsx
app/home/admin-controls/appointments/page.tsx app/home/orgchart/page.tsx
app/home/admin-controls/ticket-support/page.tsx app/home/overflow/page.tsx
app/home/admin-dashboard/page.tsx             app/home/projects/page.tsx
app/home/applicants/page.tsx                  app/home/settings/profile/page.tsx
app/home/certificate-preview/page.tsx         app/home/settings/services/page.tsx
app/home/clients/page.tsx                     app/home/ticket-support/page.tsx
app/home/hire/page.tsx
app/home/in-house/page.tsx
```

**Keep the directive only where a stale render would be wrong**, e.g.
`admin-controls/appointments` (its comment says "fresh real-time parameters").
When in doubt, keep it and note it in your report.

> ⚠️ **Do not remove it from a route whose build then fails with
> "Dynamic server usage: … used `cookies`".** That error means the route must
> stay dynamic. This exact trap was hit in the previous phase on
> `settings/services`: moving a fetch server-side made the route try to
> prerender, the Supabase call failed, and the page silently rendered from an
> empty `?? []` fallback while the build still reported success. **The build log
> is the only place this shows up** — `tsc` and the dev server both look fine.
> After this step, grep the build log:
> ```powershell
> Select-String -LiteralPath "$env:TEMP\p8-build.log" -Pattern "Dynamic server usage"
> ```
> Expected: **0 matches.**

### 2.5 Gate for P1

- Build log: **0** `Dynamic server usage` errors.
- Navigate Home → Feeds → Home → Overflow → Home. On each **return** visit
  within 30 s: **no skeleton**, no RSC request for that route.
- After editing contact info on `/home/settings/profile` and navigating away and
  back, the **new** value shows (proves §2.3 revalidation works).
- Kanban still renders and its board still drag-and-drops.

Write `scripts/p8-navcache.mjs` to automate the first two: count
`.animate-pulse` appearances and `RSC: 1` requests on a revisit.

---

## 3. P2 — Over-fetching

### 3.1 `getCurrentCodev` — `select("*")` on every authenticated request

**File: `apps/codebility/lib/server/current-codev.ts` (L21–24)**

```ts
const { data, error } = await supabase
  .from("codev")
  .select("*")          // ← every column of the widest table in the app
  .eq("id", user.id)
  .single();
```

This runs in `app/home/layout.tsx`, i.e. **on every authenticated route**. It is
`cache()`-deduped per request, so it runs once per request — but it always pulls
every column.

**Task:** determine the columns actually consumed and select only those.

1. Find the real consumers:
   ```powershell
   cd apps\codebility
   Get-ChildItem -LiteralPath "app","components","store" -Recurse -File -Include *.tsx,*.ts |
     Select-String -Pattern "getCurrentCodev|initialUser|useUserStore" |
     ForEach-Object { "$($_.Path):$($_.LineNumber)" }
   ```
2. The known consumers are `UserProvider` → `useUserStore` (navbar avatar/name/
   email/role), `getSidebarRoleId` (`role_id`, `internal_status`,
   `availability_status`), and per-page reads.
3. Replace `select("*")` with an explicit column list covering exactly those.
4. **Keep the `Codev` type honest.** If the narrowed row no longer satisfies
   `Codev`, introduce a `CurrentCodev` type for the narrowed shape rather than
   casting. A cast here will produce runtime `undefined` on some page that reads
   a column you dropped.

> ⚠️ This is the highest-blast-radius change in the plan: every authenticated
> page reads this object. Do it **last** within P2, and verify by loading every
> route in §6.2 and checking for `undefined` in the UI, not just for absence of
> errors.

### 3.2 The remaining 49 `select("*")` calls

Full list: `Get-ChildItem -LiteralPath "lib\server","actions" -Recurse -File -Include *.ts | Select-String -Pattern '\.select\(\s*"\*"'`

**Do not mass-rewrite these.** Fix only those on a hot path, in this order:

1. `lib/server/codev-queries.ts:12,18` — codev lists (`/home/interns`,
   `/home/in-house`, `/home/codevs` render many rows; every extra column is
   multiplied by row count).
2. `actions/settings/profile.ts` (8 occurrences) — profile page.
3. `actions/overflow/actions.ts:73` — the questions list.
4. `actions/feeds/post.ts:268,315,334` — the feed list.

For each: read the consuming component, list the fields it renders, and select
exactly those. Leave `lib/server/kanban-*` alone (excluded).

**Rule:** a `select("*")` feeding a **list** is worth fixing; one feeding a
**single row** that the page largely displays is usually not. Report which you
skipped and why.

### 3.3 Always-on client fetches nobody asked for

**`app/home/_components/SurveyWidget.tsx` (L30–41)** is mounted in `HomeChrome`,
so it is alive on **every** `/home` route for **every** user, and unconditionally
fires two server actions:

```ts
const { data, isLoading } = useQuery({
  queryKey: surveysKey,
  queryFn: async () => {
    const [pending, dismissed] = await Promise.all([
      getPendingSurveyForUser(),
      getDismissedSurveys(),
    ]);
    ...
  },
});
```

These are 2 of the 3 POSTs on every authenticated page load.

**Tasks:**

1. Add an explicit cache policy so it does not refetch on focus/remount:
   ```ts
   staleTime: 10 * 60 * 1000,
   gcTime: 30 * 60 * 1000,
   refetchOnWindowFocus: false,
   ```
   (The provider default is `staleTime: 5 min` but `refetchOnWindowFocus: true`
   and `refetchOnMount: true` — see `hooks/query/reactQuery.tsx` L17–23 — so
   every tab refocus currently re-issues both actions.)
2. **Better: move it to the server.** `getPendingSurveyForUser()` is a server
   action; resolve it in `app/home/layout.tsx` and pass the result into
   `HomeChrome` as a prop, exactly as the sidebar promise is handled. Then the
   widget issues **zero** client requests on load and only mutates on dismiss.
3. If a client query must remain, seed it with `initialData` from the server so
   the first paint issues no request.

**Also review** `components/notifications/NotificationContainer.tsx` +
`useNotificationPolling`: confirm polling is not running while the panel is
closed, and that the interval is cleared on unmount.

### 3.4 Gate for P2

- `/home` server-action POSTs: **3 → 1** (notifications only) if §3.3 item 2 is
  done, else still 3 but with no refetch on tab refocus.
- `/home/settings/profile`: `/api/profile-points` requests stay at **2**
  (`node scripts/count-points.mjs`).
- No route regresses on POST count (`scripts/probe-actions.mjs`).
- Every route in §6.2 renders real values — **no `undefined`, no blank name or
  avatar** — after the §3.1 column narrowing.

---

## 4. P3 — Render components only when needed

### 4.1 What is actually mounted at login

`app/home/_components/HomeChrome.tsx` mounts these on every authenticated page:

```
<ModalProviderHome />   // subscribes to 7 Zustand stores
<ToastNotification />
<NavigationOptimizer />
<Navbar mobileNav={...} />
<SurveyWidget />        // + 2 server actions (see §3.3)
```

**`ModalProviderHome` is already correct about dialogs** — the registry is
`lazy()`, and it is verified at **0 dialogs mounted at idle, 1 after click**.
Do not rewrite it.

What remains is narrower: the provider imports **seven** store hooks
(`use-modal`, `-applicants`, `-clients`, `-projects`, `-sprints`, `-users`,
`-services`), so all seven store modules land in the shared chunk and the
provider re-renders on any of their writes.

**Tasks:**

1. Confirm the provider's own render cost is real before changing it. Measure
   with React DevTools Profiler or a render counter; if it renders only when a
   modal opens, **leave it alone and say so**.
2. If it does re-render on unrelated store writes, subscribe with selectors that
   return a primitive (`(s) => s.type`) rather than destructuring the store, so
   an unrelated field change does not re-render it.
3. `SurveyWidget` — handled by §3.3.
4. `ToastNotification` and `NavigationOptimizer` — read both. If either does
   work on mount that only matters after an interaction, defer it. If they are
   already inert, say so and move on.

### 4.2 Route-level deferral

Check whether any **page** statically imports a component that is only shown
behind an interaction (a modal, a drawer, a preview pane). `next/dynamic` those.

Known candidate: `app/home/page.tsx` L4 statically imports `FeaturePromoModal`,
rendered as `{modal && <FeaturePromoModal data={modal} />}`.

> ⚠️ **Measure before and after; this can regress.** In the previous phase,
> dynamic-importing the admin-dashboard charts produced a **worse** result
> (117 kB page / 227 → 228 kB first load) because Next had *already* code-split
> `recharts` into its own chunk. That change was reverted. `FeaturePromoModal`
> is only 132 lines with no heavy dependencies, so the likely correct outcome
> here is **"leave it alone"**. Only keep a `next/dynamic` change if the build
> output actually shrinks.

### 4.3 Gate for P3

- `scripts/verify-modals.mjs` still reports **0 dialogs idle / 1 after click**.
- Build: no route's First Load JS **increases**.
- Any deferral you keep is backed by a before/after number from the build log.

---

## 5. Architectural rules (follow these, they are the house style)

The public pages set the pattern; `/home` is being brought in line with it.

1. **Server Components fetch. Server Actions mutate.** A page should `await` its
   data, not hand a loading state to the client.
2. **TanStack Query is a last resort**, for genuinely client-driven data:
   tab switching, pagination, optimistic updates, polling. When used, **seed it
   with `initialData` from the server parent** so first paint issues no request.
3. **Zustand for shared client state, with selector subscriptions.** Subscribe to
   the narrowest value: `useStore((s) => s.field)`, never `const { a, b } = useStore()`.
   Reference: `store/UserProvider.ts` documents why its render-phase seed is
   deliberate — **do not "fix" it**; moving that seed into an effect was already
   tried and made the navbar paint empty.
4. **No `useEffect` for data, derived state, or state syncing.** See §0.3.
5. **Element props over inline nesting** for anything rendered above
   `{children}`, so server-created elements survive client re-renders.
6. **Never import an async Server Component into a `"use client"` module.** It
   throws "is an async Client Component". Render it in the server layout and pass
   it down — `HomeChrome.tsx` carries this warning in a comment.
7. **`unstable_cache` only for data identical for every user.** It cannot wrap
   anything reading cookies/headers. Per-user data uses React `cache()` +
   Server Component + `<Suspense>`. Applying `unstable_cache` to per-user data
   will either throw or leak one user's data to another.
8. **Comment only what the code cannot say** — a non-obvious constraint or a
   deliberate ceiling. Repo baseline is 1–5% comment lines.

---

## 6. Verification — run after EVERY section

### 6.1 Commands

```powershell
cd apps\codebility

# 1. Types (the build will NOT catch these). Source errors must be 0.
node ..\..\node_modules\typescript\bin\tsc --noEmit --pretty false

# 2. Full suite: routes, interactions, skeleton timing, RSC TTFB
node scripts\suite.mjs

# 3. Interactions that the refactors touch
node scripts\interactions.mjs

# 4. Per-route action counts
node scripts\probe-actions.mjs "/home"
node scripts\probe-actions.mjs "/home/feeds"
node scripts\count-points.mjs

# 5. Canonical invariants
node scripts\verify-home.mjs        "http://localhost:3000/home"
node scripts\verify-nav.mjs         "http://localhost:3000/home"
node scripts\verify-modals.mjs      "http://localhost:3000/home/projects"
node scripts\verify-leaderboard.mjs "http://localhost:3000/home"

# 6. Build — STOP THE DEV SERVER FIRST (see §0.4)
cd ..\..
node "C:\Users\Programming\AppData\Roaming\npm\node_modules\pnpm\bin\pnpm.cjs" codebility:build 2>&1 |
  Tee-Object -FilePath "$env:TEMP\p8-build.log"
Select-String -LiteralPath "$env:TEMP\p8-build.log" -Pattern "Dynamic server usage"
```

### 6.2 Invariants — all must hold after every section

| Check | Expected |
|---|---|
| `tsc --noEmit` source errors | **0** (5 pre-existing in `.next/types`) |
| Build `Dynamic server usage` | **0** |
| `verify-home` POSTs | **3** (or **1** if §3.3 item 2 lands) |
| `verify-home` tabs / rows / sidebar | **9 / 10 / 17** |
| `verify-nav` sidebar / nav links | **17 / 16** |
| `verify-modals` idle / after click | **0 / 1** |
| `count-points.mjs` | **2** |
| Page errors, all routes | **0** |
| `/home` RSC TTFB | ≤ ~450 ms (3-run range) |
| `/home/kanban` RSC TTFB | no worse than ~584 ms |
| First Load JS, any route | no increase |

### 6.3 Routes to load and eyeball

`/home`, `/home/feeds`, `/home/overflow`, `/home/projects`, `/home/interns`,
`/home/in-house`, `/home/my-team` + one `[projectId]`, `/home/settings/profile`,
`/home/settings/services`, `/home/admin-dashboard`, **`/home/kanban` + open a
board**.

Check for `undefined`, blank names, missing avatars — not just absence of console
errors. §3.1 can produce a perfectly error-free page with empty fields.

### 6.4 Manual check after §2

Open a kanban board and confirm **drag-and-drop, the task modal, and the
rich-text editor** still work. P1 changes global caching that kanban inherits,
and an RSC timing number will not catch a broken drag handler.

**Never mark a section complete on a single run.** Dev timings are noisy.

---

## 7. Known pre-existing issues — do NOT attribute these to your changes

1. **5 typecheck errors in `.next/types/**`** — Next 15 made `params` a Promise;
   `home/hire/applications/[jobId]`, `home/kanban/ticket/[ticketCode]`,
   `home/promote-modal/[id]`, `nda-signing/[token]` were never updated. Real
   bugs, separate ticket.
2. **`generateServicesPDF` is dead code.** ~190 lines of html2canvas/jspdf in
   `app/home/settings/services/_components/ServicesPageClient.tsx` with **no
   caller** — confirmed absent at baseline too. The preview modal's button says
   "View Proposal" and navigates to `/proposal`. Either wire it up or delete it;
   it is a product decision, not a perf one.
3. **`app/home/(dashboard)/_components/DashboardProgressRoadmap.tsx` is dead** —
   310 lines, zero importers, still fetches `/api/profile-points` raw. Deleting
   it is the natural follow-up to the MUI-era `DashboardRoadmap` deletion.
4. **`/home/test-notifications` and `/home/test-meeting-notification`** are test
   routes shipped in the app. Deletion was proposed and never approved.
5. **`Error fetching project members: Bad Request`** — `lib/server/project-members-query.ts`
   plus 4 call sites. Recurs in the dev log, never investigated.
6. **Redis unconfigured** — `Redis configuration missing - cache will be disabled`
   on every request. `unstable_cache` still works (filesystem-backed).
7. **`tooling/tailwind/package.json` lacks `"type": "module"`** →
   `MODULE_TYPELESS_PACKAGE_JSON` warning every build.

---

## 8. Largest remaining risk — deliberately OUT of scope

`middleware.ts` runs on **every** navigation to every `/home` route:

```
auth.getUser()                          → network to Supabase auth
mfa.getAuthenticatorAssuranceLevel()
.from("codev").select(...)              → network
.from("roles").select(...)              → network (conditional)
```

Then `layout.tsx` **independently repeats** `auth.getUser()` + a `codev` select
via `getCurrentCodev()`. Middleware and layout **cannot share a React `cache()`**
— different execution contexts.

Collapsing this is the biggest remaining win, but it touches authentication.
Supabase **deliberately** recommends `getUser()` over `getSession()` in
middleware because it revalidates the token server-side. **Do not swap it to
chase latency.** Treat as a separate project with explicit security review.

---

## 9. Execution order

| # | Section | Scope | Risk |
|---|---|---|---|
| 1 | §2.2 `staleTimes` | global | low — **biggest user-visible win** |
| 2 | §2.3 revalidate on mutations | global | medium — correctness guard for #1 |
| 3 | §2.4 remove cargo-culted `force-dynamic` | 21 routes | ⚠️ medium (silent empty-render trap) |
| 4 | §3.3 SurveyWidget → server | global | low |
| 5 | §3.2 hot-path `select("*")` | per-file | low |
| 6 | §4.1 / §4.2 mount deferral | per-component | ⚠️ can regress — measure |
| 7 | §3.1 `getCurrentCodev` columns | global | ⚠️ **high** — do last |
| 8 | §6 verification | after every section | — |

Do #1 and #2 together — #1 without #2 can serve a user their own stale write.

---

## 10. Reporting requirements

For every section, report:

1. **Files changed**, one line of reasoning each.
2. **Effects removed**, and the replacement used. If you kept an effect, name the
   external system it synchronises with.
3. **If you added any `useEffect`** — flag it prominently with justification.
   The standing rule is that you do not.
4. **Measurements**: before/after, **3 runs**, reported as a range.
5. **What you did not do**, and why.

**Report honestly, and measure before claiming.** In the previous phase:

- A "8 → 2 requests" improvement was reported from **counting call sites**. When
  actually measured it was **4 → 2**. Two of the seven call sites were dead
  because the page never passed them an `id`.
- A suspected render loop turned out to be a one-time mount spike.
- Dynamic-importing `recharts` looked obviously correct and was a **no-op**,
  because Next had already split it. It was reverted.
- Two Playwright checks **passed against the wrong DOM element** (the navbar
  notification bell) and had to be rewritten before they meant anything.

State what you **measured**, never what you expected. A number you did not
observe is not a result.

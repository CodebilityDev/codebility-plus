# Production preview: private route audit

**Target:** `https://codebility-plus-codebility-portal-22ly08bdz-zeff01s-projects.vercel.app`
**Date:** 2026-09-21
**Method:** Playwright against the deployed preview, authenticated as an admin
(`david.estrelloso.tribugenia@gmail.com`). Every number below is from a probe in
`apps/codebility/scripts/preview-*.mjs`. Nothing in the app was edited.

Signed in, then hard-loaded all 33 static `/home` routes plus the dynamic ones,
recording per route: server-action POSTs, RSC prefetches, time to content,
skeleton paints, page errors, console errors, and rendered text.

---

## 1. Headline findings

| # | Finding | Severity | Evidence |
|---|---|---|---|
| F1 | **Every paginated route re-fetches page 1 after the server already rendered it** | High | `preview-dupfetch.mjs`: 6/6 routes, exactly 1 duplicate each |
| F2 | **`/home/time-tracker` throws a server render error** and shows "Unable to load time logs" | High | `preview-content.mjs` |
| F3 | **The sidebar prefetches 11 RSC payloads per load**, each a full server render through middleware | Medium | `preview-sidebar.mjs` |
| F4 | **`/home/my-team/[projectId]` raises React error #419 on both projects** | Medium | `preview-dynamic.mjs` |
| F5 | **Route loads take 45–53 seconds** | Medium | `preview-all-routes.mjs` |

F1 is the bug behind "navigating causes it to revalidate and fetch again".

---

## 2. F1 — the duplicate page-1 fetch

### What happens

A hard load of any paginated route fires a server action **after** the server
has already sent page 1 in the HTML. Nobody touches the page.

`preview-dupfetch.mjs`, each route hard-loaded and then left idle for 16 s:

| Route | rows rendered | duplicate page-1 fetch | fires after | payload |
|---|---|---|---|---|
| `/home/in-house` | 10 | **1** | 2.7 s | `{page:1, pageSize:10, filters:{...}}` |
| `/home/interns` | 0 | **1** | 10.0 s | `{page:1, pageSize:30, filters:{...}}` |
| `/home/projects` | 0 | **1** | 5.9 s | `{page:1, pageSize:12, categoryId:undefined}` |
| `/home/clients` | 0 | **1** | 4.2 s | `{page:1, pageSize:12}` |
| `/home/tasks` | 0 | **1** | 2.8 s | `{codevId:..., page:1, pageSize:9}` |
| `/home/applicants` | 4 | **1** | 3.4 s | `{status:"applying", page:1, search:undefined}` |

A separate idle trace on `/home/clients` shows the shape clearly:

```
7.2s   hydration
7.3s   ACTION /home/clients  body "[]"                        <- layout action, benign
11.3s  ACTION /home/clients  body [{"page":1,"pageSize":12}]  <- THE DUPLICATE
```

### Root cause

`apps/codebility/hooks/query/use-paginated-query.ts` line 37:

```ts
...(seeded ? { initialData, initialDataUpdatedAt: 0 } : {})
```

`initialDataUpdatedAt: 0` marks the seeded entry as **immediately stale**. That
was deliberate: it is what makes a *filter change* fetch again, which fixed the
dead-filter bug in Phase 10. But the same setting applies to the **initial**
render, where the server already supplied exactly that data. TanStack therefore
throws the server's page 1 away and re-requests it.

The 2.7–10.0 s delay is the refetch being scheduled rather than immediate, so the
server's data paints first and is then replaced. That is the visible "it
revalidated" symptom, and it forces the skeleton to appear over data that was
already correct.

### Why it matters

- One wasted server round trip per route visit, each passing through middleware
  that itself runs `auth.getUser()`, a `codev` select and a `roles` select.
- The skeleton flashes over good data.
- It is the exact "fetch again even though nothing changed" behaviour reported.

### Fix direction

The seed needs to distinguish two cases that currently share one code path:

- the key the server rendered → seeded, **fresh**, no fetch
- any other key (filter, page, sort) → fetch

`initialDataUpdatedAt` should be "now" for the matching key, not `0`. Not
implemented: awaiting approval.

---

## 3. F2 — `/home/time-tracker` server error

### Symptom

The route renders the error boundary instead of the page:

```
⏱️ Unable to load time logs
We couldn't retrieve your time tracking data. Please check your connection and try again.
```

Three console errors fire:

```
Error: An error occurred in the Server Components render. The specific message
is omitted in production builds... (digest property is included)
ErrorBoundary caught an error: ...
Async Error: ...
```

This is the "something went wrong / server side error" reported.

### Root cause

`apps/codebility/app/home/time-tracker/page.tsx` line 34:

```ts
.from("codev")
.select(`start_time, end_time, time_log (...)`)
.eq("user_id", user?.id)     // <-- no such column
.single();
```

The `codev` table keys on `id`. Every other `codev` query in the app filters by
`.eq("id", ...)`. `user_id` does not exist on that table, so PostgREST rejects
the request and the server render throws.

### Fix direction

`.eq("user_id", user?.id)` → `.eq("id", user?.id)`. One line.

---

## 4. F3 — sidebar prefetch volume

`/home` has **16** sidebar links. A single load fires **11** `?_rsc=` prefetches:

```
/ , /home/kanban , /home/feeds , /home/interns , /home/my-team , /home/overflow ,
/home/orgchart , /home/admin-dashboard , /home/applicants , /home/in-house , /home/clients
```

The remaining 5 fire as you navigate (`/home/projects`, `/home/hire`,
`/home/admin-controls`, `/home/settings`, `/home/ticket-support`). A navigation
trace showed 86 prefetches when routes were visited back to back.

Each prefetch is a full server render passing through `middleware.ts`, which per
request runs `auth.getUser()`, a `codev` select and a `roles` select. Prefetching
is Next's default for in-viewport `<Link>`s; the app never opts out.

**Note:** the Router Cache itself works. A revisit to an already-visited route
cost **1** request (`site.webmanifest` only), so `staleTimes: 3600` is doing its
job. The cost is prefetch, not cache miss.

---

## 5. F4 — React error #419 on `/home/my-team/[projectId]`

Both real projects raise it:

| Route | error |
|---|---|
| `/home/my-team/1a053d2d-...` | `Minified React error #419` (hydration mismatch) |
| `/home/my-team/e2e1a591-...` | `Minified React error #419` |

The first also renders a stuck "Loading member statis..." string. React #419 is a
Suspense/hydration boundary error. Both `/leaderboard` sub-routes are clean.

---

## 6. F5 — load times

`preview-all-routes.mjs`, hard load, time to settle:

```
/home                                  47381ms
/home/admin-controls/appointments      52535ms
/home/admin-controls/client-tracker    48527ms
/home/settings/profile                 48142ms
/home/my-team                          47458ms
/home/applicants                       47495ms
... (33 routes, all 44.9s - 52.5s except one)
/home/time-tracker                     20266ms  (fails fast)
```

Every route costs 45–53 s regardless of how much it renders. That flatness
points at a fixed per-request cost rather than per-route queries: the middleware
chain plus the prefetch set.

---

## 7. Full route results

All 33 static routes. `pf` = RSC prefetches observed during that load.

| Route | ms | pf | Notes |
|---|---|---|---|
| `/home` | 47381 | 11 | skeleton |
| `/home/account-settings` | 45575 | 17 | |
| `/home/admin-controls` | 46431 | 19 | |
| `/home/admin-controls/appointments` | 52535 | 17 | |
| `/home/admin-controls/client-tracker` | 48527 | 12 | skeleton |
| `/home/admin-controls/ticket-support` | 47010 | 17 | 1 ticket renders |
| `/home/admin-dashboard` | 45113 | 16 | |
| `/home/applicants` | 47495 | 16 | **DUP fetch** |
| `/home/certificate-preview` | 46209 | 17 | |
| `/home/clients` | 46227 | 11 | **DUP fetch** |
| `/home/feeds` | 46403 | 11 | skeleton |
| `/home/hire` | 46652 | 12 | skeleton |
| `/home/in-house` | 46060 | 16 | **DUP fetch** |
| `/home/interns` | 46046 | 16 | **DUP fetch** |
| `/home/kanban` | 44964 | 18 | |
| `/home/my-team` | 47458 | 17 | |
| `/home/orgchart` | 45646 | 17 | renders fine |
| `/home/overflow` | 47010 | 11 | skeleton |
| `/home/projects` | 46448 | 16 | **DUP fetch** |
| `/home/promote-modal` | 45225 | 17 | |
| `/home/settings` | 46544 | 13 | renders fine |
| `/home/settings/account-settings` | 45649 | 17 | |
| `/home/settings/news-banners` | 45775 | 17 | |
| `/home/settings/profile` | 48142 | 17 | skeleton |
| `/home/settings/services` | 45745 | 17 | |
| `/home/settings/services/cms-diagnostic` | 46250 | 17 | |
| `/home/settings/services/diagnostic` | 45389 | 17 | |
| `/home/settings/surveys` | 45551 | 17 | renders fine |
| `/home/tasks` | 46868 | 86 | **DUP fetch**, React #418 |
| `/home/test-meeting-notification` | 45890 | 39 | |
| `/home/test-notifications` | 46785 | 17 | |
| `/home/ticket-support` | 46645 | 12 | |
| `/home/time-tracker` | 20266 | 17 | **SERVER ERROR** |

### Dynamic routes

| Route | Result |
|---|---|
| `/home/kanban/<project>` | renders (sprint list) |
| `/home/kanban/<project>/<board>` | renders (board with columns) |
| `/home/my-team/<project>` | renders, **React #419** |
| `/home/my-team/<project>/leaderboard` | renders clean |
| `/home/settings/surveys/<unknown-id>` | "Failed to fetch survey" (correct for a bogus id) |

---

## 8. Corrections and false positives

I want these on the record, because two of my intermediate readings were wrong.

- **I first reported the Router Cache was being wiped. It is not.** A direct
  revisit measured 1 request. I had misread prefetch traffic in the first probe.
- **`/home/tasks` appeared to redirect to `/home/applicants`** in the bulk run.
  On a clean hard load it does not; `preview-trace.mjs` shows it staying put. The
  bulk probe overlapped navigations. Not an app bug.
- **`/home/test-meeting-notification` appeared to redirect to `/home`.** Same
  cause. On a clean load it stays.
- **404 console errors** appeared in the bulk run but not on a clean `/home`
  load. Transient; not reproduced.
- **`orgchart`, `settings`, `settings/surveys`, `admin-controls/ticket-support`**
  flagged as low-content turned out to render real data; my content threshold was
  counting `tbody tr` on card/heading layouts.
- **`/home/tasks` React #418** (text hydration mismatch) is separate from F1 and
  was not investigated further.

---

## 9. Suggested order

1. **F2** — one-line column fix, restores a completely broken route.
2. **F1** — the seed/stale distinction; removes a wasted round trip and a
   skeleton flash on every paginated route.
3. **F4** — investigate the #419 hydration mismatch.
4. **F3/F5** — prefetch and per-request middleware cost. Biggest win on load
   time, but the widest blast radius; worth its own plan.

---

## Appendix: probes

All read-only, in `apps/codebility/scripts/`:

| Script | Purpose |
|---|---|
| `preview-login.mjs` | opens the preview and waits for sign-in |
| `preview-all-routes.mjs` | walks all 33 static routes, writes `preview-routes-report.json` |
| `preview-dupfetch.mjs` | quantifies the duplicate page-1 fetch |
| `preview-idle.mjs` | timeline of an untouched page load |
| `preview-cache.mjs` | first visit vs revisit vs second revisit |
| `preview-actions.mjs` | server-action payloads per navigation |
| `preview-nav.mjs` | per-navigation timing, skeletons, requests |
| `preview-firstload.mjs` | duplicate fetches per route |
| `preview-trace.mjs` | document/redirect trace for one route |
| `preview-content.mjs` | rendered text per route |
| `preview-dynamic.mjs` | dynamic routes with real ids |
| `preview-sidebar.mjs` | sidebar link count vs prefetches |

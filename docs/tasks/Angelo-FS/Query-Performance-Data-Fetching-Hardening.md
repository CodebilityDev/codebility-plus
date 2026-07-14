# Query Performance & Data-Fetching Hardening

## Summary

There are a few spots in `apps/codebility` where we fetch data inefficiently, and they'll only get worse as the `codev` table grows. A couple of `select("*")` queries with no limit, one place that pulls the whole table into the browser through a pagination loop, some data fetched client-side on every page load that could be server-rendered, and a couple of N+1 patterns. The goal is to clean up the data layer without changing anything the user sees.

## Technical Context

**Unbounded / over-fetching:**
- `app/(marketing)/_components/landing/LandingAdmins.tsx:29-30` — `from("codev").select("*").eq("role_id", 1)` and `.eq("role_id", 5)`, no `.limit()`. Fetches all admins/mentors for a featured display.
- `app/home/kanban/[projectId]/[id]/_components/tasks/_components/TaskComments.tsx` (`fetchUsers`, ~line 1154) — `from("codev").select(...).order("first_name")` with **no `.limit()`**; fetches the entire `codev` table for @mention suggestions, and is re-invoked on comment lifecycle/realtime events.
- `store/codev-store.ts` (~line 42) — store hydrates via `select("*")` on `codev`.
- Worth a look too: `DashboardWeeklyTop.tsx` `attendance_points` select-all, `FilterCodevs.tsx` positions/projects select-all, and the profile page's work_experience/education with no limit.

**Client-side fetch that should be server-side / cached:**
- `app/home/my-team/AddMembersModal.tsx:387-435` — a `while (true)` loop with `PAGE_SIZE = 1000` paginating the full `codev` table **in the browser**. Should be a server action returning a filtered, bounded result.
- Same idea for `FilterCodevs.tsx` and `NewsBanner.tsx`, which fetch in `useEffect` on every load — good candidates for server components or cached fetches.

**N+1 / sequential:**
- `kanban/[projectId]/[id]/actions.ts` `updateDeveloperLevels` (~lines 33-52) — one query per skill category in a `.map`; batch with a single `.in("skill_category_id", [...])`.
- `TaskComments.tsx` author hydration is already batched with `.in("id", authorIds)` but is re-run frequently — cache it.

A few of these I've confirmed in the code (the `LandingAdmins`, `TaskComments` mention fetch, and `AddMembersModal` loop); the "worth a look" ones I haven't double-checked recently, so confirm them against current source before touching.

## Objectives

- Add sensible bounds (`.limit()` + pagination/`.in()` where appropriate) to all unbounded `select("*")` / list queries, especially on `codev`.
- Move the client-side full-table pagination in `AddMembersModal` to a **server action** that returns filtered, bounded results.
- Convert per-page-load client fetches (filter data, news banners) to server components or cached fetches (React Query/SWR with sensible stale time, or RSC).
- Replace the unbounded @mention user fetch with a bounded query + client-side filtering (or server-side mention search), and cache it so it isn't re-fetched on every realtime event.
- Batch the confirmed N+1 queries.

## Sprint Plan (1 fortnightly sprint)

- **Week 1:** Bound all unbounded queries (limits/pagination), fix the @mention fetch + caching, and batch the `updateDeveloperLevels` N+1. Lowest-risk, immediate wins.
- **Week 2:** Move `AddMembersModal` member loading to a server action; convert filter-data and news-banner client fetches to server-rendered/cached. Verify no behavior change and measure before/after query counts.

## Expected Behavior

- No screen fetches an entire large table to the browser; lists are bounded and/or paginated.
- @mention suggestions and member pickers load from bounded queries and don't re-fetch the whole table on every interaction/realtime event.
- Product behavior (what the user sees and can do) is unchanged; only performance improves.

## Acceptance Criteria

- No remaining unbounded `select("*")`/list query on `codev` (or other large tables) without a `.limit()` or pagination — check with a grep and a quick review.
- `AddMembersModal` no longer runs a browser-side `while(true)` pagination loop; member data comes from a bounded server action.
- Filter data and news banners are no longer fetched client-side on every page load (server-rendered or cached).
- The confirmed N+1 in `updateDeveloperLevels` is collapsed to a single batched query.
- Before/after notes in the PR show reduced query counts / payload sizes for at least the @mention and member-loading paths.
- No functional regressions.

## Reminders

- Coordinate with the auth-hardening task (Jury) on the new member-loading server action so it's built once, with auth, and reused.
- Perform comprehensive testing before PR; include before/after measurements.

## Instructions

- Branch: `query-performance-hardening/angelo`. One PR per phase is recommended.
- Comprehensive PR description documenting each query changed and why. Request team-lead review. Maintain Kanban status.

## Got any questions?

Reach out to your assigned team lead via the team group chat.
</content>

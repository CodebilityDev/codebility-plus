# Row-Level Security (RLS) Completion & Audit

## Summary

The Supabase database has **partial, explicitly-incomplete** Row-Level Security. A set of Feb-2026 migrations (`supabase/migrations/20260219_*`) added policies for some tables (`attendance`, `ticket_support`, task *comments*, `profile_points`, `attendance_points`, `notification_queue`), but the work was deliberately scoped "without making assumptions about column names" and left TODOs. Critically, the `codev` table has **RLS disabled** — `20260219_critical_security_fixes.sql:199` raises `'WARNING: codev table RLS is DISABLED - should enable RLS on codev table'`.

That leaves several sensitive tables with no access control at the DB layer: `codev`, `tasks`/kanban boards/columns/sprints, `appointments`, and `project_members`, among others. And since a lot of the server actions don't check auth either (that's Jury's task), these tables are effectively open to any logged-in session right now. This task closes the DB-layer gap: enable RLS on the uncovered tables, write the policies, finish the existing TODOs, and produce a coverage map so we know where we stand.

## Technical Context

- Existing RLS migrations to read first: `20260219_critical_security_fixes.sql`, `20260219_rls_critical_fixes.sql`, `20260219_rls_critical_fixes_v2.sql`, `20260219_rls_hotfix*.sql`, `20260219_rls_remove_duplicates.sql`, `fix_notification_rls_policies.sql`, and the `RLS_POLICY_TEMPLATES.md` reference.
- **Known gaps / TODOs to resolve:** `20260219_rls_critical_fixes_v2.sql` has TODOs (~lines 365, 369) for owner-based UPDATE/DELETE and restricting task access to participants "when column names are confirmed" — confirm the actual schema (`database-schema.md`) and complete them.
- **Role semantics:** Admin = `role_id` 1 (confirmed). Policies should align with the same permission model the app uses (`roles` table + `project_members` for project-scoped tables) so DB policies and the app-layer guards (Jury's task) agree. Coordinate on the exact membership/role predicates.
- Migrations follow `apps/codebility/supabase/migrations/YYYYMMDD_description.sql`.

## Objectives

- **Enable RLS on the `codev` table** and write policies: a user may read/update their own row; admins (`role_id` 1) may manage all; restrict sensitive columns appropriately. (Note: `20260219_critical_security_fixes.sql:205` already defines an update policy but RLS is not enabled — enabling it is the missing step; reconcile with that policy.)
- Enable RLS and add correct policies for the other uncovered sensitive tables: `tasks`, `kanban_board`/`kanban_column`/`kanban_sprint`, `appointments`, `project_members` (and any others surfaced by the audit). Project-scoped tables gate on `project_members` membership + role.
- Resolve the outstanding TODOs in the `20260219_*` migrations (owner/participant-based UPDATE/DELETE).
- Remove duplicate/conflicting policies (there is already a `rls_remove_duplicates` migration — extend that hygiene).
- Produce an **RLS coverage matrix** (doc or migration comment) listing every table, whether RLS is enabled, and which policies apply for SELECT/INSERT/UPDATE/DELETE.

## Sprint Plan (1 fortnightly sprint)

- **Week 1:** Audit all tables for current RLS status (enabled? policies?) and produce the coverage matrix. Enable RLS + policies for `codev` (highest risk) and `appointments`. Test against real roles (admin, member, non-member) using the Supabase SQL editor / a test session.
- **Week 2:** Enable RLS + policies for the kanban tables and `project_members`; resolve the v2 migration TODOs; dedupe conflicting policies. Re-run the full coverage matrix to confirm no sensitive table is left open.

## Expected Behavior

- With RLS enabled, a direct query/mutation (e.g. via the anon/authenticated Supabase client) that a user is not authorized for is **rejected at the database**, regardless of what the application layer does.
- Users can read/modify only their own `codev` data unless they are admins.
- Project-scoped rows (tasks, sprints, attendance, etc.) are only accessible to members of that project (and admins).
- Legitimate app flows continue to work because the policies match the app's role/membership model.

## Acceptance Criteria

- RLS is **enabled** on `codev` and all previously-uncovered sensitive tables (`tasks`, kanban boards/columns/sprints, `appointments`, `project_members`).
- Each such table has explicit, correct policies for SELECT/INSERT/UPDATE/DELETE matching the `roles` + `project_members` model.
- The TODOs in the `20260219_*` RLS migrations are resolved (no placeholder "add later" gaps for owner/participant access).
- No duplicate or contradictory policies remain.
- An RLS coverage matrix is delivered covering every table.
- Verified: with a low-privilege test session, direct cross-user / cross-project reads and writes are blocked by the DB; an authorized session succeeds. App flows (kanban, dashboard, my-team, appointments) still work end-to-end.
- All changes are delivered as properly-named migrations under `supabase/migrations/`.

## Reminders

- Coordinate role/membership predicates with the app-layer auth task (Jury) so the two layers agree.
- Test policies carefully before shipping — an over-tight policy can break legitimate flows; an over-loose one defeats the purpose. Verify with multiple role/session types.
- Do not weaken existing working policies (attendance, ticket_support, comments) — only extend coverage.

## Instructions

- Branch: `rls-completion-audit/kris`. Deliver changes as migrations; one PR per phase is recommended.
- Comprehensive PR description listing each table, the RLS state change, and the policies added. Request team-lead review. Maintain Kanban status.

## Got any questions?

Reach out to your assigned team lead via the team group chat.
</content>

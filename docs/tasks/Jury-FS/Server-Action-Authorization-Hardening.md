# Server-Action Authorization Hardening

## Summary

We have a lot of server actions in `apps/codebility` that mutate data without checking who's calling them — somewhere north of 35 functions across 9 files. They rely on the UI hiding controls by role and on the route middleware, but neither actually protects a server action: any logged-in user can call the action directly (through its RPC endpoint or a plain `fetch`) and skip every UI gate. The middleware in `middleware.ts` only runs on page navigation, not on action calls. This task adds a real authorization check to each of these actions.

This is a real, exploitable surface. For example, the dashboard actions take a `codevId` parameter and update the `codev` table by id with no check that the caller *is* that user — so any session can edit or delete another user's schedule, timers, availability, or NDA status. The `codev` table also has **RLS disabled** (see migration `20260219_critical_security_fixes.sql:199`), so there is currently *no* backstop for those mutations at all.

The goal is to add a consistent authorization layer to every mutating server action, gating on the caller's identity (`auth.getUser()`) and `role_id` / project membership — never on UI state, name strings, or hardcoded emails. PR #596 (the founder-backdoor fix, merge `4d1949ff`) is the **worked example** of the correct fix shape.

## Technical Context

- The recurring anti-patterns (see related portal-wide notes): **(1)** no `getUser()` at all; **(2)** auth gated on a brittle signal (name string / hardcoded email) instead of `role_id`; **(3)** user-controlled values interpolated into PostgREST `.or()` grammar.
- **Correct pattern** (from PR #596): at the top of each action, before any data lookup —
  1. `const { data: { user } } = await supabase.auth.getUser();` → reject if absent.
  2. Look up caller's `codev.role_id` via `.eq("id", user.id)` (NOT `.or()` interpolation, NOT email).
  3. Verify the required permission against the `roles` table, matching the gate the middleware applies to the corresponding page (`routePermissionMap` in `middleware.ts`).
  4. For project-scoped mutations (kanban, attendance, meetings), additionally verify membership via `project_members`.
- **Deliverable foundation:** create a reusable helper (e.g. `lib/server/auth-guard.ts` exporting `requireUser()`, `requireRole(roleId)`, `requireProjectMember(projectId)`) so every action calls one well-tested guard instead of re-implementing checks. Land this helper first.

### Actions that need a guard

- `app/home/(dashboard)/actions.ts` — `updateUserSchedule`, `startUserTimer`, `stopUserTimer`, `logUserTime`, `updateUserTaskOnHand`, `updateUserAvailabilityStatus`
- `app/home/in-house/actions.ts` — `updateCodev`, `updateNdaUrls`, `sendNdaEmailAction`, `deleteCodevAction`
- `app/home/admin-controls/appointments/actions.ts` — `updateAppointmentStatus`
- `app/home/promote-modal/actions.ts` — `upsertActiveModal`, `createModal`, `deleteModal`, `toggleModalActive`
- `app/home/ticket-support/actions.ts` — `submitTicket` (also: stop trusting client-supplied `userId`)
- `app/home/my-team/actions.ts` — `createChecklistItem`, `updateChecklistItem`, `deleteChecklistItem` (Flavor 2: replace `.eq("email_address", user.email)` lookups with `.eq("id", user.id)`)
- `app/home/kanban/[projectId]/[id]/actions.ts` — `updateTaskColumnId`, `createNewTask`, `updateTask`, `deleteTask`, `createNewColumn`, `updateColumnPosition`, `completeTask`, `batchUpdateTasks`, `updateTaskPRLink`, `unarchiveTask`, `saveDraft`, `deleteDraft`, `promoteDraft` (several call `getUser()` *after* mutating, only for notifications — move the check before the mutation)
- `app/home/kanban/[projectId]/actions.ts` — `createNewSprint`, `EditSprint` · `app/home/kanban/actions.ts` — `createNewBoard`
- `app/home/my-team/[projectId]/actions.ts` — `saveAttendance`, `bulkSaveAttendance`, `saveMeetingSchedule`, `createMeeting` (stop trusting client `created_by`)
- `app/home/overflow/actions.ts` — `postQuestion`, `updateQuestion`, `deletePostAndImages`, `postComment`, `markAsSolution`, `updateComment`, `deleteComment`, `togglePostLike`, `toggleCommentLike` (ownership checks for edit/delete)

This is the list we know about. Before wrapping up, grep the rest of the `"use server"` files for mutations (`.insert/.update/.delete/.upsert/.rpc`) and make sure each one is guarded too — there are probably a few more.

## Objectives

- Implement a shared, tested authorization helper and apply it to **every** mutating server action in `apps/codebility`.
- Gate each action on `auth.getUser()` + `role_id` (and `project_members` membership where project-scoped), matching the permission the middleware enforces for the corresponding page.
- Replace email-based / name-based identity lookups with `user.id`-based lookups.
- Ensure no user-controlled value is interpolated into PostgREST `.or()`/`.filter()` grammar; use parameterized `.eq()` lookups.
- Return clear, non-leaking errors (`Unauthorized` / `Forbidden`) without exposing internal details.

## Sprint Plan (1 fortnightly sprint)

- **Week 1:** Land the `auth-guard` helper. Harden the user/identity & admin surface — `(dashboard)`, `in-house`, `appointments`, `promote-modal`, `ticket-support`, and the `my-team` checklist identity fix. These touch the RLS-disabled `codev` table and are the highest risk.
- **Week 2:** Harden the project-scoped & community surface — all `kanban/**` actions (tasks, columns, drafts, sprints, boards) with `project_members` checks, `my-team/[projectId]` attendance/meetings, and `overflow` post/comment ownership. Final sweep grep to confirm zero unguarded mutations remain.

## Expected Behavior

- Invoking any mutating server action without a valid session returns `Unauthorized` and performs no DB write.
- A user without the required role/permission (or who is not a member of the target project) receives `Forbidden` and performs no write.
- Legitimate users with the correct role/membership experience no functional change.
- Identity is always resolved from `user.id`, never email or name.

## Acceptance Criteria

- A reusable auth-guard utility exists, is unit-testable, and is used by every mutating server action.
- Every action in the confirmed inventory (and any others found during the sweep) performs an auth + (where applicable) permission/membership check **before** any mutation.
- No mutating server action gates authorization on a name string, hardcoded email, or client-supplied identity field (`userId`, `created_by`, etc.).
- No PostgREST `.or()`/`.filter()` call interpolates an unescaped user-controlled value.
- Manual verification: attempting a cross-user / cross-project mutation with a low-privilege session is rejected; the same action succeeds for an authorized user.
- No regressions to legitimate flows (kanban, dashboard, my-team, appointments, overflow, in-house).

## Reminders

- This pairs with the RLS task (Kris). Coordinate so the role/permission semantics match between the app guard and the DB policies, but do not block on it — app-layer guards must stand on their own.
- Perform comprehensive testing before PR. Include a short note in the PR describing how you verified rejection of an unauthorized call.

## Instructions

- Branch: `server-action-authorization-hardening/jury`. Consider splitting into a couple of PRs (one per phase) to keep reviews manageable.
- Include a comprehensive PR description documenting each action changed and the guard applied.
- Request review from your team lead. Maintain Kanban card status as work progresses.

## Got any questions?

Reach out to your assigned team lead via the team group chat.
</content>

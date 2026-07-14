# Server-Action Auth Hardening — Week 2: Project-Scoped & Community Actions

## Summary

Week 1 of the auth-hardening work shipped: the `auth-guard.ts` helper landed and the identity/admin surface (dashboard, in-house, promote-modal, ticket-support, my-team checklist, appointments) now checks the caller before mutating. The project-scoped and community surface was never done. Five files still mutate the database with no authorization at all — roughly 49 mutating actions that any logged-in user can call directly through the action endpoint, skipping every UI and page-middleware gate. This task closes that remaining half.

This is high risk because these same tables have no database backstop either: RLS is still disabled on the relevant tables, so there is currently no protection at either layer.

## Background

Confirmed current state on `dev`:

- `kanban/[projectId]/[id]/actions.ts` — ~23 mutations (tasks, columns, drafts). Some functions call `getUser()` but only *after* the mutation, for notifications — so it authenticates nothing. This is the single biggest exposure, and it's also why the Move-to-Sprint feature (PR #594) merged without server-side auth.
- `overflow/actions.ts` — ~16 mutations (posts, comments, likes) with no auth and no ownership checks on edit/delete.
- `my-team/[projectId]/actions.ts` — ~5 mutations (attendance, meetings); also trusts a client-supplied `created_by`.
- `kanban/[projectId]/actions.ts` — ~4 mutations (create/edit sprint).
- `kanban/actions.ts` — 1 mutation (create board).

The helper to use already exists: `lib/server/auth-guard.ts` exports `requireUser()`, `requireRole(permissionKey)`, `requireProjectMember(projectId)`, and `requireSelfOrRole(...)`. Week 1 files are the worked examples of the correct call pattern.

## Objectives

- Apply an authorization check to every mutating action in the five files above, using the existing `auth-guard.ts` helper — never UI state, name strings, hardcoded emails, or client-supplied identity fields.
- For project-scoped actions (all kanban files, my-team attendance/meetings), gate on `requireProjectMember(projectId)` in addition to authentication, matching the permission the middleware enforces for the corresponding page.
- In `kanban/[projectId]/[id]/actions.ts`, move the existing `getUser()` calls to the top of each action so the check happens *before* the mutation, not after.
- For `overflow` post/comment edit and delete, enforce ownership (the caller must own the row) — or an admin/appropriate role.
- Stop trusting client-supplied identity in `my-team/[projectId]` (`created_by`) — derive it from `user.id`.
- Return clear, non-leaking `Unauthorized` / `Forbidden` errors and perform no write on rejection.

## Expected Behavior

- Invoking any of these actions without a valid session returns `Unauthorized` and writes nothing.
- A user who is not a member of the target project (or not the owner, for overflow edits/deletes) receives `Forbidden` and writes nothing.
- Legitimate members with the right role/membership see no functional change.
- Identity and `created_by` are always resolved from `user.id`, never from client input.

## Acceptance Criteria

- [ ] Every mutating action in `kanban/[projectId]/[id]/actions.ts`, `kanban/[projectId]/actions.ts`, `kanban/actions.ts`, `my-team/[projectId]/actions.ts`, and `overflow/actions.ts` performs an auth (and where applicable membership/ownership) check **before** any mutation.
- [ ] The kanban `[id]` actions no longer call `getUser()` only after mutating — the check is up front.
- [ ] Project-scoped actions verify `project_members` membership via `requireProjectMember`.
- [ ] Overflow edit/delete actions enforce row ownership (or admin).
- [ ] `my-team/[projectId]` derives `created_by` from `user.id`, not client input.
- [ ] Manual verification: a low-privilege / non-member session is rejected on a cross-project task edit, an overflow post delete it doesn't own, and an attendance write for a project it's not on; the same actions succeed for an authorized member.
- [ ] Final sweep: grep the remaining `"use server"` files for `.insert/.update/.delete/.upsert/.rpc` and confirm no unguarded mutation remains anywhere.

## Solution Hint

Treat these as advisory, not prescriptive.

- Reuse `lib/server/auth-guard.ts` exactly as the Week 1 files do — don't re-implement checks. For a project-scoped action that already receives `projectId`, `await requireProjectMember(projectId)` at the top is usually enough; for board/sprint creation, gate on the kanban permission via `requireRole("kanban")` plus membership where a project context exists.
- In the kanban `[id]` file, the fix for the notification-only `getUser()` calls is to hoist the auth to the first line of each action and reuse that user for both the check and the later notification.
- For overflow ownership, compare the row's author id to `user.id` before update/delete; allow an admin role to override if that matches current product behavior.
- Consider splitting into two PRs (kanban vs overflow+attendance) to keep the review manageable, as the original task suggested.

## Reminders

- Pairs with Kris's RLS task — keep the role/membership semantics aligned with the DB policies, but don't block on it; the app-layer guard must stand on its own.
- Test rejection explicitly and note in the PR how you verified an unauthorized call is blocked.
- Don't regress legitimate flows — kanban board/task/sprint/draft operations, attendance, meetings, and overflow posting should all still work for authorized members.

## Instructions

- Branch: `server-action-auth-hardening-week2/jury`. Splitting into two PRs is fine.
- PR description: list each action changed and the guard applied, plus the rejection test you ran.

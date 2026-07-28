# Server-Action Auth Hardening — Week 2 (PR #609) Review Notes
## Implementation review / for discussion with the author — prepared by Deo

> Companion to `Server-Action-Auth-Hardening-Week2-ProjectScoped.md`.
> PR: #609 `feat(auth): harden project-scoped & community server actions (Week 2)` by `bonfire404` (Jury).
> Branch: `server-action-auth-hardening-week2/jury` → `dev`. 5 files, +536 / −59. Reviewed 2026-07-14 (read-only).

---

## Verdict

**Strong PR — near-approve.** Coverage is complete across all five files and goes beyond the spec. Two hardening items to fix before merge, plus a couple of non-blocking nits.

## What's done well (acknowledge this)

- **Full coverage** of every mutating action in all 5 files (kanban task/column/draft, sprints, board, attendance/meetings, overflow posts/comments/likes) — including actions not in the original inventory (`updateColumnName`, `deleteColumn`, `markAsSolution`, `syncAllAttendancePoints`, `sendMeetingNotification`).
- **`transferTaskToSprint` is now guarded** → this also closes the outstanding PR #594 kanban-transfer auth blocker.
- **Client-supplied identity fixed everywhere:** `created_by` (tasks/drafts/meetings), `authorId` (overflow posts), and the `userId` params on `togglePostLike`/`toggleCommentLike` are now ignored and derived from the session.
- **After-mutation `getUser` fixed:** auth is hoisted to the top of each action and the user object reused for later notification logic.
- Sensible helper design: `getProjectIdForTask/Column/Board` + `assertProjectMembership` (admin bypass via `role_id === 1`, else `project_members`), and `assertOwnerOrAdmin` for overflow edit/delete.

---

## Should-fix #1 — `assertProjectMembership` fails OPEN

**Where:** `kanban/[projectId]/[id]/actions.ts`, in `assertProjectMembership`.

**Problem:**
```ts
if (!projectId) return; // skips the membership check entirely
```
When the project can't be resolved, the guard is skipped and only authentication is enforced. That's acceptable when the *task doesn't exist* (the mutation is a genuine no-op), but a **target that exists yet resolves no project** — an orphaned board with `project_id = null`, an RLS/permission hiccup, or a transient failed sub-query — would bypass authorization. A security guard should **fail closed**.

**How to fix — distinguish "target missing" from "project unresolved":**
Have the resolver tell the caller whether the target row existed, and deny when it existed but no project was found.

```ts
// Return a discriminated result instead of just string | null
type ProjectResolution =
  | { found: false }               // target row doesn't exist → mutation is a real no-op
  | { found: true; projectId: string | null };

async function getProjectIdForColumn(supabase, columnId): Promise<ProjectResolution> {
  if (!columnId) return { found: false };
  const { data: column } = await supabase
    .from("kanban_columns").select("board_id").eq("id", columnId).single();
  if (!column) return { found: false };
  const { data: board } = await supabase
    .from("kanban_boards").select("project_id").eq("id", column.board_id).single();
  return { found: true, projectId: board?.project_id ?? null };
}

async function assertProjectMembership(supabase, userId, res: ProjectResolution) {
  if (!res.found) return;                 // target truly doesn't exist → allow no-op
  if (!res.projectId) throw new Error("Forbidden"); // exists but unresolved → DENY
  // …admin bypass + project_members check as before…
}
```
Simpler alternative if you don't want the discriminated type: keep returning `string | null`, but in `assertProjectMembership` **throw `Forbidden` on `null`** instead of returning, and only skip the check in the specific callers where a missing row is provably a no-op (or let those no-op mutations run — an unauthenticated-but-authorized call against a non-existent id is harmless once auth is already enforced).

---

## Should-fix #2 — `completeTask` authorizes on a client-supplied value

**Where:** `kanban/[projectId]/[id]/actions.ts`, `completeTask(task: Task)`.

**Problem:**
```ts
const guardProjectId = await getProjectIdForColumn(supabase, task.kanban_column_id);
```
The whole `task` object comes from the client, so `task.kanban_column_id` is attacker-controlled. Someone could pass a `kanban_column_id` from a project they *are* a member of to pass the check, while the mutation acts on other fields of the crafted object. Every other task action resolves the project from the **trusted id via a server re-fetch** — this one should too.

**How to fix — resolve from the task's real id, not the passed-in column:**
```ts
// Instead of trusting task.kanban_column_id:
const guardProjectId = await getProjectIdForTask(supabase, task.id);
await assertProjectMembership(supabase, user.id, guardProjectId);
```
If `completeTask` genuinely needs the column for its logic, still *authorize* against `getProjectIdForTask(task.id)` (DB-truth), and treat any client-passed column as display data only. Also confirm the actual mutation targets `task.id` (server-trusted), not client-passed fields.

---

## Nits (non-blocking)

1. **Duplicated membership logic.** `[id]/actions.ts` reimplements the admin-bypass + `project_members` check in its own `assertProjectMembership`, while `lib/server/auth-guard.ts` already has `requireProjectMember`. Two sources of truth — if the rule changes, both must be updated. Suggest exporting a `requireProjectMemberByProjectId(projectId, userId)` (or `assertProjectMembership`) from `auth-guard.ts` and reusing it here, so there's one canonical implementation.
2. **Query depth on hot paths.** The resolver runs column→board→project as two sequential queries, plus role + membership = up to ~4 round-trips per action. On drag-heavy paths (`updateColumnPosition`, `batchUpdateTasks`) that's added latency. Could be a single joined query / RPC later. Not blocking.

---

## Verification checklist (before merge)

- [ ] Should-fix #1 applied — guard denies when a target exists but no project resolves (fail-closed).
- [ ] Should-fix #2 applied — `completeTask` authorizes via `getProjectIdForTask(task.id)`, not the client column.
- [ ] Manual test: non-member session is rejected (`Forbidden`) on a cross-project task edit, column delete, sprint edit, attendance write, and overflow post/comment delete it doesn't own; the same succeed for an authorized member/admin.
- [ ] Legitimate flows still work: kanban drag/drop, task CRUD, drafts, sprint transfer, attendance, meetings, overflow post/comment/like.
- [ ] (Optional) membership logic de-duplicated against `auth-guard.ts`.

## Ready-to-paste PR comment

See the version drafted in the 2026-07-14 session (Deo posts it himself — no auto-posting to GitHub per current account caution).

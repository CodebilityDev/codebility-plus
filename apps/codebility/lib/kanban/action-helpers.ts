import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";

export interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

export type GuardSupabase = Awaited<ReturnType<typeof createClientServerComponent>>;

// ── Authorization helpers ────────────────────────────────────────────────────
// All kanban actions here operate on a task/column/draft id, so we resolve the
// owning project and verify membership (admins bypass) before mutating.
//
// Resolvers return a discriminated result so assertProjectMembership can
// distinguish "target row doesn't exist" (safe no-op) from "target exists but
// no project could be resolved" (deny — fail closed).  See PR #609 review.

type ProjectResolution =
  | { found: false }
  | { found: true; projectId: string | null };

export async function getProjectIdForColumn(
  supabase: GuardSupabase,
  columnId: string | null | undefined,
): Promise<ProjectResolution> {
  if (!columnId) return { found: false };
  const { data: column } = await supabase
    .from("kanban_columns")
    .select("board_id")
    .eq("id", columnId)
    .single();
  if (!column) return { found: false };
  if (!column.board_id) return { found: true, projectId: null };
  const { data: board } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", column.board_id)
    .single();
  return { found: true, projectId: board?.project_id ?? null };
}

export async function getProjectIdForTask(
  supabase: GuardSupabase,
  taskId: string,
): Promise<ProjectResolution> {
  const { data: task } = await supabase
    .from("tasks")
    .select("kanban_column_id")
    .eq("id", taskId)
    .single();
  if (!task) return { found: false };
  return getProjectIdForColumn(supabase, task.kanban_column_id);
}

export async function getProjectIdForBoard(
  supabase: GuardSupabase,
  boardId: string,
): Promise<ProjectResolution> {
  const { data: board } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", boardId)
    .single();
  if (!board) return { found: false };
  return { found: true, projectId: board.project_id ?? null };
}

/**
 * Throws "Forbidden" unless the caller is a member of the resolved project or
 * an admin.  Fail-closed: if the target row exists but no project could be
 * resolved (orphaned board, null FK, transient query failure) access is DENIED.
 * Only when the target row itself doesn't exist (genuine no-op) is the check
 * skipped — the subsequent mutation will harmlessly match zero rows.
 */
export async function assertProjectMembership(
  supabase: GuardSupabase,
  userId: string,
  resolution: ProjectResolution,
): Promise<void> {
  // Target row doesn't exist → the mutation will be a real no-op.
  if (!resolution.found) return;

  // Target exists but project could not be resolved → DENY (fail closed).
  if (!resolution.projectId) throw new Error("Forbidden");

  const projectId = resolution.projectId;

  const { data: me } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", userId)
    .single();

  if (me?.role_id === 1) return; // admin bypass

  const { data: member } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("codev_id", userId)
    .maybeSingle();

  if (!member) {
    throw new Error("Forbidden");
  }
}

/** List routes only. Active board UI is client-authoritative during the session. */
export function revalidateKanbanBoardLists(projectId?: string | null) {
  revalidatePath("/home/kanban");
  if (projectId) {
    revalidatePath(`/home/kanban/${projectId}`);
  }
}

type TaskPositionRow = {
  id: string;
  kanban_column_id: string | null;
  position: number;
};

export async function fetchColumnTasks(
  supabase: GuardSupabase,
  columnId: string,
): Promise<TaskPositionRow[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, kanban_column_id, position")
    .eq("kanban_column_id", columnId)
    .or("is_archive.is.null,is_archive.eq.false")
    .order("position", { ascending: true });

  if (error) throw error;
  return (data ?? []) as TaskPositionRow[];
}

export function buildPositionUpdates(
  sourceColumnId: string | null,
  sourceTasks: TaskPositionRow[],
  targetColumnId: string,
  targetTasks: TaskPositionRow[],
  taskId: string,
  targetPosition: number,
): Array<{ id: string; kanban_column_id: string; position: number }> {
  const sourceList =
    sourceColumnId === targetColumnId
      ? targetTasks
      : sourceTasks.filter((task) => task.id !== taskId);

  const targetList =
    sourceColumnId === targetColumnId
      ? [...sourceList]
      : [
          ...targetTasks.filter((task) => task.id !== taskId),
        ];

  const insertAt = Math.max(0, Math.min(targetPosition, targetList.length));
  targetList.splice(insertAt, 0, {
    id: taskId,
    kanban_column_id: targetColumnId,
    position: insertAt,
  });

  const updates: Array<{ id: string; kanban_column_id: string; position: number }> =
    targetList.map((task, index) => ({
      id: task.id,
      kanban_column_id: targetColumnId,
      position: index,
    }));

  if (sourceColumnId && sourceColumnId !== targetColumnId) {
    sourceList.forEach((task, index) => {
      updates.push({
        id: task.id,
        kanban_column_id: sourceColumnId,
        position: index,
      });
    });
  }

  return updates;
}

export async function persistTaskPositions(
  supabase: GuardSupabase,
  updates: Array<{ id: string; kanban_column_id: string; position: number }>,
) {
  const results = await Promise.all(
    updates.map((row) =>
      supabase
        .from("tasks")
        .update({
          kanban_column_id: row.kanban_column_id,
          position: row.position,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

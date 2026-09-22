import { requireUser } from "@/lib/server/auth-guard";
import { createClientServerComponent } from "@/utils/supabase/server";

import type { BoardSnapshotInput } from "@/lib/kanban/board-snapshot-types";

type GuardSupabase = Awaited<ReturnType<typeof createClientServerComponent>>;

type ProjectResolution =
  | { found: false }
  | { found: true; projectId: string | null };

async function getProjectIdForBoard(
  supabase: GuardSupabase,
  boardId: string,
): Promise<ProjectResolution> {
  const { data: board } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", boardId)
    .single();

  if (!board) {
    return { found: false };
  }

  return { found: true, projectId: board.project_id ?? null };
}

async function assertProjectMembership(
  supabase: GuardSupabase,
  userId: string,
  resolution: ProjectResolution,
): Promise<void> {
  if (!resolution.found) {
    return;
  }

  if (!resolution.projectId) {
    throw new Error("Forbidden");
  }

  const projectId = resolution.projectId;

  const { data: me } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", userId)
    .single();

  if (me?.role_id === 1) {
    return;
  }

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

export async function persistBoardSnapshot(
  snapshot: BoardSnapshotInput,
): Promise<{ success: boolean; error?: string }> {
  let supabase: GuardSupabase;
  let user;

  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const projectResolution = await getProjectIdForBoard(supabase, snapshot.boardId);
    await assertProjectMembership(supabase, user.id, projectResolution);

    if (
      !projectResolution.found ||
      projectResolution.projectId !== snapshot.projectId
    ) {
      return { success: false, error: "Forbidden" };
    }

    const { data: boardColumns, error: columnsError } = await supabase
      .from("kanban_columns")
      .select("id")
      .eq("board_id", snapshot.boardId);

    if (columnsError) {
      throw columnsError;
    }

    const boardColumnIds = new Set((boardColumns ?? []).map((column) => column.id));

    const columnUpdates = snapshot.columns.filter((column) =>
      boardColumnIds.has(column.id),
    );

    const taskUpdates = snapshot.tasks.filter((task) =>
      boardColumnIds.has(task.kanban_column_id),
    );

    const columnResults = await Promise.all(
      columnUpdates.map((column) =>
        supabase
          .from("kanban_columns")
          .update({
            position: column.position,
            updated_at: new Date().toISOString(),
          })
          .eq("id", column.id)
          .eq("board_id", snapshot.boardId),
      ),
    );

    const failedColumn = columnResults.find((result) => result.error);
    if (failedColumn?.error) {
      throw failedColumn.error;
    }

    if (taskUpdates.length > 0) {
      const taskResults = await Promise.all(
        taskUpdates.map((task) =>
          supabase
            .from("tasks")
            .update({
              kanban_column_id: task.kanban_column_id,
              position: task.position,
              updated_at: new Date().toISOString(),
            })
            .eq("id", task.id),
        ),
      );

      const failedTask = taskResults.find((result) => result.error);
      if (failedTask?.error) {
        throw failedTask.error;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("persistBoardSnapshot error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save board",
    };
  }
}

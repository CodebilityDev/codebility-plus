"use server";

import { Task, TaskDraft } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { requireUser } from "@/lib/server/auth-guard";
import { createNotificationAction } from "@/actions/notifications/notification.actions";
import {
  fetchTaskDetail,
  type KanbanTaskDetail,
} from "@/lib/server/kanban-task-query";
import { fetchMemberBoardTasks as fetchMemberBoardTasksQuery } from "@/lib/server/kanban-member-tasks-query";
import { fetchColumnTasksPage as fetchColumnTasksPageQuery } from "@/lib/server/kanban-column-tasks-query";
import { KANBAN_COLUMN_TASK_PAGE_SIZE } from "@/lib/kanban/board-pagination";
import type { BoardSnapshotInput } from "@/lib/kanban/board-snapshot-types";
import { persistBoardSnapshot } from "@/lib/server/kanban-board-snapshot-sync";
import { updateDeveloperLevels } from "@/lib/kanban/update-developer-levels";
import {
  type CodevMember,
  type GuardSupabase,
  assertProjectMembership,
  buildPositionUpdates,
  fetchColumnTasks,
  getProjectIdForBoard,
  getProjectIdForColumn,
  getProjectIdForTask,
  persistTaskPositions,
  revalidateKanbanBoardLists,
} from "@/lib/kanban/action-helpers";

export type { BoardSnapshotInput } from "@/lib/kanban/board-snapshot-types";

export async function moveTask({
  taskId,
  columnId,
  position,
  opId: _opId,
}: {
  taskId: string;
  columnId: string;
  position: number;
  opId?: string;
}): Promise<{ success: boolean; error?: string }> {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectResolution = await getProjectIdForTask(supabase, taskId);
  try {
    await assertProjectMembership(supabase, user.id, projectResolution);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, kanban_column_id, position")
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return { success: false, error: "Task not found" };
    }

    const sourceColumnId = task.kanban_column_id;
    const [sourceTasks, targetTasks] = await Promise.all([
      sourceColumnId ? fetchColumnTasks(supabase, sourceColumnId) : Promise.resolve([]),
      fetchColumnTasks(supabase, columnId),
    ]);

    const updates = buildPositionUpdates(
      sourceColumnId,
      sourceTasks,
      columnId,
      targetTasks,
      taskId,
      position,
    );

    await persistTaskPositions(supabase, updates);

    return { success: true };
  } catch (error) {
    console.error("moveTask error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to move task",
    };
  }
}

export async function syncBoardSnapshot(
  snapshot: BoardSnapshotInput,
): Promise<{ success: boolean; error?: string }> {
  return persistBoardSnapshot(snapshot);
}

export async function batchUpdateTasks(
  updates: Array<{ taskId: string; newColumnId: string }>,
): Promise<{ success: boolean; error?: string }> {
  if (updates.length === 0) {
    return { success: true };
  }

  const last = updates[updates.length - 1]!;
  return moveTask({
    taskId: last.taskId,
    columnId: last.newColumnId,
    position: 0,
  });
}

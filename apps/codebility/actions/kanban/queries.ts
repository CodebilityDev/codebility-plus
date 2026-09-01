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

export async function fetchColumnTasksPage(
  columnId: string,
  offset: number,
  limit: number = KANBAN_COLUMN_TASK_PAGE_SIZE,
): Promise<{ success: boolean; tasks?: Task[]; error?: string }> {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const projectResolution = await getProjectIdForColumn(supabase, columnId);
    await assertProjectMembership(supabase, user.id, projectResolution);

    const tasks = await fetchColumnTasksPageQuery(
      supabase,
      columnId,
      offset,
      limit,
    );
    return { success: true, tasks };
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return { success: false, error: "Forbidden" };
    }
    console.error("Error fetching column tasks page:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch column tasks",
    };
  }
}

export async function fetchMemberBoardTasks(
  boardId: string,
  memberId: string,
): Promise<{ success: boolean; tasks?: Task[]; error?: string }> {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const projectResolution = await getProjectIdForBoard(supabase, boardId);
    await assertProjectMembership(supabase, user.id, projectResolution);

    const tasks = await fetchMemberBoardTasksQuery(supabase, boardId, memberId);
    return { success: true, tasks };
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return { success: false, error: "Forbidden" };
    }
    console.error("Error fetching member board tasks:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch member tasks",
    };
  }
}

export async function getTaskDetail(
  taskId: string,
): Promise<{ success: boolean; data?: KanbanTaskDetail; error?: string }> {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const projectResolution = await getProjectIdForTask(supabase, taskId);
    await assertProjectMembership(supabase, user.id, projectResolution);

    const data = await fetchTaskDetail(supabase, taskId);
    if (!data) {
      return { success: false, error: "Task not found" };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error && error.message === "Forbidden") {
      return { success: false, error: "Forbidden" };
    }
    console.error("Error fetching task detail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch task",
    };
  }
}


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
import { KANBAN_COLUMN_TASK_PAGE_SIZE } from "@/constants/kanban/pagination";
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

export const createNewColumn = async (
  columnName: string,
  boardId: string,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForBoard(supabase, boardId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { data: existingColumns, error: queryError } = await supabase
      .from("kanban_columns")
      .select("position")
      .eq("board_id", boardId)
      .order("position", { ascending: false })
      .limit(1);

    if (queryError) {
      return { success: false, error: queryError.message };
    }

    const nextPosition = (existingColumns?.[0]?.position ?? -1) + 1;

    const { error: insertError } = await supabase
      .from("kanban_columns")
      .insert({
        name: columnName.trim(),
        board_id: boardId,
        position: nextPosition,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Database error:", insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create column",
    };
  }
};

export const updateColumnPosition = async (
  columnId: string,
  newPosition: number,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForColumn(supabase, columnId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { error } = await supabase
      .from("kanban_columns")
      .update({
        position: newPosition,
        updated_at: new Date().toISOString(),
      })
      .eq("id", columnId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating column position:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update column position",
    };
  }
};

export const deleteColumn = async (
  columnId: string,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForColumn(supabase, columnId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { error } = await supabase
      .from("kanban_columns")
      .delete()
      .eq("id", columnId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete column",
    };
  }
};

export const updateColumnName = async (
  columnId: string,
  newName: string,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForColumn(supabase, columnId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { error } = await supabase
      .from("kanban_columns")
      .update({
        name: newName.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", columnId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update column name",
    };
  }
};

// OPTIMIZED: Complete task with parallel operations to prevent timeouts

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

export const saveDraft = async (
  formData: FormData,
  draftId?: string | null
): Promise<{ success: boolean; draftId?: string; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Never trust a client-supplied creator — derive it from the session.
    const created_by = user.id;
    const project_id = formData.get("project_id")?.toString();
    const intended_column_id = formData.get("intended_column_id")?.toString();

    // Validate required fields
    if (!project_id || !intended_column_id) {
      return {
        success: false,
        error: "Missing required fields: project_id or intended_column_id"
      };
    }

    // Only project members (or admins) may create/edit drafts in this project.
    try {
      await assertProjectMembership(supabase, user.id, { found: true, projectId: project_id ?? null });
    } catch {
      return { success: false, error: "Forbidden" };
    }

    // Extract all form fields
    const draftData = {
      created_by,
      project_id,
      intended_column_id,
      title: formData.get("title")?.toString() || null,
      description: formData.get("description")?.toString() || null,
      priority: formData.get("priority")?.toString() || null,
      difficulty: formData.get("difficulty")?.toString() || null,
      type: formData.get("type")?.toString() || null,
      pr_link: formData.get("pr_link")?.toString() || null,
      points: formData.get("points") ? Number(formData.get("points")) : null,
      deadline: formData.get("deadline")?.toString() || null,
      skill_category_id: formData.get("skill_category_id")?.toString() || null,
      codev_id: formData.get("codev_id")?.toString() || null,
      sidekick_ids: formData.get("sidekick_ids")
        ?.toString()
        .split(",")
        .filter(Boolean) || [],
      last_saved_at: new Date().toISOString(),
    };

    let result;

    if (draftId) {
      // Update existing draft
      const { data, error } = await supabase
        .from("task_drafts")
        .update(draftData)
        .eq("id", draftId)
        .select("id")
        .single();

      if (error) {
        console.error("Error updating draft:", error);
        return { success: false, error: error.message };
      }

      result = data;
    } else {
      // Create new draft (upsert to handle unique constraint)
      const { data, error } = await supabase
        .from("task_drafts")
        .upsert(draftData, {
          onConflict: "created_by,intended_column_id",
        })
        .select("id")
        .single();

      if (error) {
        console.error("Error creating draft:", error);
        return { success: false, error: error.message };
      }

      result = data;
    }

    return { success: true, draftId: result.id };
  } catch (error) {
    console.error("Error saving draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save draft",
    };
  }
};

/**
 * Get all drafts for a user in a specific project
 * @param projectId - Project UUID
 * @param userId - User's codev.id
 * @returns Array of TaskDraft objects
 */
export const getUserDrafts = async (
  projectId: string,
  userId: string
): Promise<{ success: boolean; drafts?: TaskDraft[]; error?: string }> => {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("task_drafts")
      .select(`
        *,
        skill_category:skill_category_id (id, name),
        codev:codev_id (id, first_name, last_name, image_url)
      `)
      .eq("project_id", projectId)
      .eq("created_by", userId)
      .order("last_saved_at", { ascending: false });

    if (error) {
      console.error("Error fetching drafts:", error);
      return { success: false, error: error.message };
    }

    return { success: true, drafts: data as any };
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch drafts",
    };
  }
};

/**
 * Load a single draft by ID
 * @param draftId - Draft UUID
 * @returns Single TaskDraft object
 */
export const loadDraft = async (
  draftId: string
): Promise<{ success: boolean; draft?: TaskDraft; error?: string }> => {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("task_drafts")
      .select(`
        *,
        skill_category:skill_category_id (id, name),
        codev:codev_id (id, first_name, last_name, image_url)
      `)
      .eq("id", draftId)
      .single();

    if (error) {
      console.error("Error loading draft:", error);
      return { success: false, error: error.message };
    }

    return { success: true, draft: data as any };
  } catch (error) {
    console.error("Error loading draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load draft",
    };
  }
};

/**
 * Delete a draft permanently
 * @param draftId - Draft UUID to delete
 * @returns Success status
 */
export const deleteDraft = async (
  draftId: string
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const { data: draftRow } = await supabase
    .from("task_drafts")
    .select("project_id")
    .eq("id", draftId)
    .single();
  try {
    await assertProjectMembership(supabase, user.id, draftRow ? { found: true, projectId: draftRow.project_id ?? null } : { found: false });
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { error } = await supabase
      .from("task_drafts")
      .delete()
      .eq("id", draftId);

    if (error) {
      console.error("Error deleting draft:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete draft",
    };
  }
};

/**
 * Promote a draft to an active task and delete the draft
 * This is a transactional operation
 * @param draftId - Draft UUID to promote
 * @returns Success status and new task ID
 */
export const promoteDraft = async (
  draftId: string
): Promise<{ success: boolean; taskId?: string; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Step 1: Fetch the draft
    const { data: draft, error: fetchError } = await supabase
      .from("task_drafts")
      .select("*")
      .eq("id", draftId)
      .single();

    if (fetchError || !draft) {
      return { success: false, error: "Draft not found" };
    }

    // Only project members (or admins) may promote a draft into a task.
    try {
      await assertProjectMembership(supabase, user.id, { found: true, projectId: draft.project_id ?? null });
    } catch {
      return { success: false, error: "Forbidden" };
    }

    // Step 2: Validate required fields for task creation
    if (!draft.title || !draft.intended_column_id || !draft.skill_category_id) {
      return {
        success: false,
        error: "Draft is incomplete. Title, column, and skill category are required.",
      };
    }

    // Step 3: Create the task
    const { data: newTask, error: createError } = await supabase
      .from("tasks")
      .insert({
        title: draft.title,
        description: draft.description || "<p>No description provided</p>",
        priority: draft.priority,
        difficulty: draft.difficulty,
        type: draft.type,
        pr_link: draft.pr_link,
        points: draft.points,
        deadline: draft.deadline,
        kanban_column_id: draft.intended_column_id,
        skill_category_id: draft.skill_category_id,
        codev_id: draft.codev_id,
        sidekick_ids: draft.sidekick_ids || [],
        created_by: draft.created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (createError) {
      console.error("Error creating task from draft:", createError);
      return { success: false, error: createError.message };
    }

    // Step 3.5: Trigger Notification if assignee exists in the draft
    if (draft.codev_id) {
      // Reuse the already-authenticated caller (checked before the mutation).
      // Only send notification if assigning to someone else
      if (user && user.id !== draft.codev_id) {
        await createNotificationAction({
          recipientId: draft.codev_id,
          title: "Draft Published & Assigned",
          message: `Task "${draft.title}" has been published and assigned to you.`,
          type: "task",
          priority: "normal",
          projectId: draft.project_id,
          actionUrl: `/home/kanban/${draft.project_id}/${draft.intended_column_id}?taskId=${newTask.id}`,
          metadata: {
            taskId: newTask.id,
            assignedAt: new Date().toISOString()
          }
        });
      }
    }

    // Step 4: Delete the draft
    const { error: deleteError } = await supabase
      .from("task_drafts")
      .delete()
      .eq("id", draftId);

    if (deleteError) {
      console.error("Error deleting draft after promotion:", deleteError);
      // Task was created, so we still return success
    }

    // Step 5: Revalidate the kanban board
    const { data: columnData } = await supabase
      .from("kanban_columns")
      .select("board_id")
      .eq("id", draft.intended_column_id)
      .single();

    if (columnData?.board_id) {
      const { data: boardData } = await supabase
        .from("kanban_boards")
        .select("project_id")
        .eq("id", columnData.board_id)
        .single();

      if (boardData?.project_id) {
        revalidateKanbanBoardLists(boardData.project_id);
      }
    }

    return { success: true, taskId: newTask.id };
  } catch (error) {
    console.error("Error promoting draft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to promote draft",
    };
  }
};

/**
 * Get draft count for a user in a project (for badge display)
 * @param projectId - Project UUID
 * @param userId - User's codev.id
 * @returns Count of user's drafts in project
 */
export const getDraftCount = async (
  projectId: string,
  userId: string
): Promise<{ success: boolean; count?: number; error?: string }> => {
  const supabase = await createClientServerComponent();

  try {
    const { count, error } = await supabase
      .from("task_drafts")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId)
      .eq("created_by", userId);

    if (error) {
      console.error("Error counting drafts:", error);
      return { success: false, error: error.message };
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("Error counting drafts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to count drafts",
    };
  }
};


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
import { moveTask } from "./board";

export const updateTaskColumnId = async (
  taskId: string,
  newColumnId: string,
): Promise<Task> => {
  const { supabase, user } = await requireUser();
  const projectId = await getProjectIdForTask(supabase, taskId);
  await assertProjectMembership(supabase, user.id, projectId);

  const targetTasks = await fetchColumnTasks(supabase, newColumnId);
  const result = await moveTask({
    taskId,
    columnId: newColumnId,
    position: targetTasks.length,
  });

  if (!result.success) {
    throw new Error(result.error ?? "Failed to move task");
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (error || !data) throw error ?? new Error("Task not found");
  return data as Task;
};

export const fetchAvailableMembers = async (
  projectId: string,
): Promise<CodevMember[]> => {
  const supabase = await createClientServerComponent();

  const { data: projectMembers, error: projectMembersError } = await supabase
    .from("project_members")
    .select("codev_id, role")
    .eq("project_id", projectId);

  if (projectMembersError || !projectMembers?.length) {
    console.error("Error fetching project members:", projectMembersError?.message);
    return [];
  }

  let teamLeaderId: string | null = null;
  let memberIds: string[] = [];

  projectMembers.forEach((member) => {
    if (member.role === "team_leader") {
      teamLeaderId = member.codev_id;
    } else {
      memberIds.push(member.codev_id);
    }
  });

  let members: CodevMember[] = [];

  if (memberIds.length > 0) {
    const { data: codevMembers, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, availability_status")
      .in("id", memberIds);

    if (codevError) {
      console.error("Error fetching project members:", codevError.message);
    } else {
      members = codevMembers.filter(
        (member) => member.availability_status === true,
      );
    }
  }

  if (teamLeaderId) {
    const { data: leaderData, error: leaderError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, availability_status")
      .eq("id", teamLeaderId)
      .single();

    if (leaderError) {
      console.error("Error fetching project leader:", leaderError.message);
    } else if (leaderData.availability_status === true) {
      members.unshift(leaderData);
    }
  }

  return members.sort((a, b) => a.first_name.localeCompare(b.first_name));
};

export const createNewTask = async (
  formData: FormData,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const priority = formData.get("priority")?.toString();
    const difficulty = formData.get("difficulty")?.toString();
    const type = formData.get("type")?.toString()?.toUpperCase();
    const pr_link = formData.get("pr_link")?.toString();
    const points = formData.get("points") ? Number(formData.get("points")) : null;
    const kanban_column_id = formData.get("kanban_column_id")?.toString();
    const codev_id = formData.get("codev_id")?.toString();
    const sidekick_ids = formData
      .get("sidekick_ids")
      ?.toString()
      .split(",")
      .filter(Boolean);
    const skill_category_id = formData.get("skill_category_id")?.toString();
    // Never trust a client-supplied creator — derive it from the session.
    const created_by = user.id;
    const deadline = formData.get("deadline")?.toString() || null;

    if (!title || !kanban_column_id || !skill_category_id) {
      return { success: false, error: "Required fields are missing (title, column, and skill category)" };
    }

    // Verify the caller belongs to the project that owns the target column.
    const projectId = await getProjectIdForColumn(supabase, kanban_column_id);
    try {
      await assertProjectMembership(supabase, user.id, projectId);
    } catch {
      return { success: false, error: "Forbidden" };
    }

    const targetTasks = await fetchColumnTasks(supabase, kanban_column_id);
    const nextPosition = targetTasks.length;

    const { data: newTask, error } = await supabase.from("tasks").insert([
      {
        title,
        description,
        priority,
        difficulty,
        type,
        pr_link,
        points,
        kanban_column_id,
        position: nextPosition,
        codev_id,
        sidekick_ids,
        skill_category_id,
        created_by,
        deadline,
      },
    ]).select("id").single();

    if (error) {
      console.error("Error creating task:", error);
      return { success: false, error: error.message };
    }

    const { data: columnData } = await supabase
      .from("kanban_columns")
      .select("board_id")
      .eq("id", kanban_column_id)
      .single();

    if (columnData?.board_id) {
      const { data: boardData } = await supabase
        .from("kanban_boards")
        .select("project_id")
        .eq("id", columnData.board_id)
        .single();

      if (boardData?.project_id) {
        revalidateKanbanBoardLists(boardData.project_id);

        if (codev_id && newTask?.id) {
          // Reuse the already-authenticated caller (checked before the mutation).
          if (user && user.id !== codev_id) {
            await createNotificationAction({
              recipientId: codev_id,
              title: "New Task Assignment",
              message: `You've been assigned to task: "${title}"`,
              type: "task",
              priority: "normal",
              projectId: boardData.project_id,
              actionUrl: `/home/kanban/${boardData.project_id}/${columnData.board_id}?taskId=${newTask.id}`,
              metadata: {
                taskId: newTask.id,
                assignedAt: new Date().toISOString()
              }
            });
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
};

export const updateTask = async (
  formData: FormData,
  taskId: string,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForTask(supabase, taskId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const rawCodevId = formData.get("codev_id")?.toString();
    const codev_id = rawCodevId === "" || rawCodevId === "null" ? null : rawCodevId;

    const rawSkillCategoryId = formData.get("skill_category_id")?.toString();
    const skill_category_id = rawSkillCategoryId === "" || rawSkillCategoryId === "null" ? null : rawSkillCategoryId;

    const rawDeadline = formData.get("deadline")?.toString();
    const deadline = rawDeadline === "" || rawDeadline === "null" ? null : rawDeadline;

    const title = formData.get("title")?.toString();

    const updateData = {
      title: title,
      description: formData.get("description")?.toString(),
      priority: formData.get("priority")?.toString(),
      difficulty: formData.get("difficulty")?.toString(),
      type: formData.get("type")?.toString(),
      pr_link: formData.get("pr_link")?.toString(),
      points: formData.get("points") ? Number(formData.get("points")) : null,
      sidekick_ids: formData.get("sidekick_ids")
        ? formData.get("sidekick_ids")?.toString().split(",").filter(Boolean)
        : [],
      skill_category_id: skill_category_id,
      codev_id: codev_id,
      deadline: deadline,
      updated_at: new Date().toISOString(),
    };

    // 1. Fetch existing task to check current assignee
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("codev_id, title, kanban_column_id")
      .eq("id", taskId)
      .single();

    if (fetchError) {
      console.error("Error fetching existing task:", fetchError);
      return { success: false, error: "Could not find task to update" };
    }

    // 2. Perform the update
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        ...updateData,
        sidekick_ids: updateData.sidekick_ids,
      })
      .eq("id", taskId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return { success: false, error: updateError.message };
    }

    // 3. NOTIFICATION LOGIC: Trigger if assignee changed and isn't null
    if (codev_id && codev_id !== existingTask.codev_id) {
      // Reuse the already-authenticated caller (checked before the mutation).
      // Only send notification if assigning to someone else
      if (user && user.id !== codev_id) {
        // Fetch project info to build the action URL
        const { data: colData } = await supabase
          .from("kanban_columns")
          .select("board_id, kanban_boards(project_id)")
          .eq("id", existingTask.kanban_column_id)
          .single();

        await createNotificationAction({
          recipientId: codev_id,
          title: "Task Assignment Update",
          message: `You've been assigned to task: "${title || existingTask.title}"`,
          type: "task",
          priority: "normal",
          projectId: (colData?.kanban_boards as any)?.project_id,
          actionUrl: `/home/kanban/${(colData?.kanban_boards as any)?.project_id}/${colData?.board_id}?taskId=${taskId}`,
          metadata: {
            taskId,
            assignedAt: new Date().toISOString()
          }
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Update task error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
  }
};

export const deleteTask = async (
  taskId: string,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForTask(supabase, taskId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { data: taskData } = await supabase
      .from("tasks")
      .select("kanban_column_id")
      .eq("id", taskId)
      .single();

    await supabase.from("tasks_comments").delete().eq("task_id", taskId);
    await supabase.from("task_ticket_codes").delete().eq("task_id", taskId);

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      return { success: false, error: error.message };
    }

    if (taskData?.kanban_column_id) {
      const { data: columnData } = await supabase
        .from("kanban_columns")
        .select("board_id")
        .eq("id", taskData.kanban_column_id)
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
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
};

export const completeTask = async (
  task: Task,
): Promise<{ success: boolean; error?: string }> => {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  // Authorize against the DB-trusted task id, NOT the client-supplied
  // task.kanban_column_id — the whole `task` object is attacker-controlled.
  // See PR #609 review, should-fix #2.
  const guardResolution = await getProjectIdForTask(supabase, task.id);
  try {
    await assertProjectMembership(supabase, user.id, guardResolution);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    // Extract IDs safely from both flat and nested structures
    const primaryAssigneeId = task.codev?.id || task.codev_id;
    const skillCategoryId = task.skill_category?.id || task.skill_category_id;
    const taskPoints = task.points;

    // Quick validation
    if (!task.id) {
      return { success: false, error: "Task ID is required" };
    }

    if (!task.pr_link || task.pr_link.trim() === "") {
      return { success: false, error: "PR Link is required to complete task" };
    }

    if (!primaryAssigneeId) {
      return { success: false, error: "Task must be assigned to complete" };
    }

    if (!skillCategoryId) {
      return { success: false, error: "Skill category is required" };
    }

    if (!taskPoints || taskPoints <= 0) {
      return { success: false, error: "Task must have points to award" };
    }

    // Archive the task immediately
    const { error: archiveError } = await supabase
      .from("tasks")
      .update({
        is_archive: true,
        updated_at: new Date().toISOString(),
        approved_at: new Date().toISOString()
      })
      .eq("id", task.id);

    if (archiveError) {
      console.error("Error archiving task:", archiveError);
      return { success: false, error: `Failed to archive task: ${archiveError.message}` };
    }

    // Fetch board and project info for the notification URL
    const { data: columnData } = await supabase
      .from("kanban_columns")
      .select("board_id")
      .eq("id", task.kanban_column_id)
      .single();

    const boardId = columnData?.board_id;
    let projectId = null;

    if (boardId) {
      const { data: boardData } = await supabase
        .from("kanban_boards")
        .select("project_id")
        .eq("id", boardId)
        .single();
      projectId = boardData?.project_id;
    }

    // OPTIMIZATION: Prepare all member IDs and points
    const sidekickPoints = Math.floor(taskPoints * 0.5);
    const allMemberIds = [
      primaryAssigneeId,
      ...(task.sidekick_ids || [])
    ];

    // Fetch all existing points records in parallel
    const pointsPromises = allMemberIds.map(memberId =>
      supabase
        .from("codev_points")
        .select("*")
        .eq("codev_id", memberId)
        .eq("skill_category_id", skillCategoryId)
        .maybeSingle()
    );

    const pointsResults = await Promise.all(pointsPromises);

    // Prepare batch updates/inserts
    const pointsOperations = allMemberIds.map((memberId, index) => {
      const pointsResult = pointsResults[index];
      const existingPoints = pointsResult?.data;
      const pointsToAward = memberId === primaryAssigneeId ? taskPoints : sidekickPoints;

      if (existingPoints) {
        // Update existing record
        return supabase
          .from("codev_points")
          .update({
            points: existingPoints.points + pointsToAward,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingPoints.id);
      } else {
        // Insert new record
        return supabase
          .from("codev_points")
          .insert({
            codev_id: memberId,
            skill_category_id: skillCategoryId,
            points: pointsToAward,
          });
      }
    });

    // Execute all points updates in parallel
    const pointsUpdateResults = await Promise.all(pointsOperations);

    // Check for critical errors
    const criticalErrors = pointsUpdateResults.filter(result => result.error);
    if (criticalErrors.length > 0) {
      console.error("Errors awarding points:", criticalErrors);
      // Task is already archived, so we continue
    }

    // Update levels for all members in parallel
    const levelUpdatePromises = allMemberIds.map(memberId =>
      updateDeveloperLevels(memberId)
    );

    await Promise.all(levelUpdatePromises);

    // Send task completion notifications to specific members who worked on the task
    try {
      const notificationPromises = allMemberIds.map(async (memberId, index) => {
        const pointsResult = pointsResults[index];
        if (!pointsResult) return null;

        const existingPoints = pointsResult.data;
        const pointsAwarded = memberId === primaryAssigneeId ? taskPoints : sidekickPoints;

        // Only send notification if points were successfully awarded
        if (!criticalErrors.some(error =>
          error.error &&
          (pointsResult?.error === error.error ||
            (!existingPoints && pointsResult?.error === error.error))
        )) {
          return createNotificationAction({
            recipientId: memberId,
            title: "Task Completed!",
            message: `Congratulations! You have completed the task '${task.title}' and gained ${pointsAwarded}+ points.`,
            type: "success",
            priority: "normal",
            actionUrl: projectId && boardId
              ? `/home/kanban/${projectId}/${boardId}?view=archive&taskId=${task.id}`
              : `/home/tasks`,
            metadata: {
              taskId: task.id,
              taskTitle: task.title,
              pointsAwarded: pointsAwarded,
              skillCategoryId: skillCategoryId,
              completedAt: new Date().toISOString()
            }
          });
        }
      });

      const notificationResults = await Promise.all(notificationPromises.filter(Boolean));
      const failedNotifications = notificationResults.filter(result => result?.error);

      if (failedNotifications.length > 0) {
        console.warn("Some notifications failed to send:", failedNotifications);
      }
    } catch (error) {
      // Log notification errors 
      console.error("Error sending task completion notifications:", error);
    }

    // Single revalidation at the end
    revalidateKanbanBoardLists(projectId);

    return { success: true };
  } catch (error) {
    console.error("Error completing task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete task",
    };
  }
};

export async function updateTaskPRLink(taskId: string, prLink: string) {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForTask(supabase, taskId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { error } = await supabase
      .from("tasks")
      .update({ pr_link: prLink, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating PR link:", error);
      return { success: false, error: error.message };
    }

    const { data: taskData } = await supabase
      .from("tasks")
      .select("kanban_column_id")
      .eq("id", taskId)
      .single();

    if (taskData?.kanban_column_id) {
      const { data: columnData } = await supabase
        .from("kanban_columns")
        .select("board_id")
        .eq("id", taskData.kanban_column_id)
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
    }

    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}

export async function unarchiveTask(taskId: string) {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }

  const projectId = await getProjectIdForTask(supabase, taskId);
  try {
    await assertProjectMembership(supabase, user.id, projectId);
  } catch {
    return { success: false, error: "Forbidden" };
  }

  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        is_archive: false,
        updated_at: new Date().toISOString()
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error unarchiving task:", error);
      return { success: false, error: error.message };
    }

    const { data: taskData } = await supabase
      .from("tasks")
      .select("kanban_column_id")
      .eq("id", taskId)
      .single();

    if (taskData?.kanban_column_id) {
      const { data: columnData } = await supabase
        .from("kanban_columns")
        .select("board_id")
        .eq("id", taskData.kanban_column_id)
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
    }

    return { success: true };
  } catch (error) {
    console.error("Unarchive error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unarchive failed",
    };
  }
}

// ============================================================================
// DRAFT TASK MANAGEMENT FUNCTIONS
// Purpose: Create, read, update, delete draft task cards
// Added: 2025-01-16
// Feature: CBP-16 - Draft Task Card Feature
// ============================================================================

/**
 * Save or update a draft task card
 * Creates new draft or updates existing one based on draftId
 * @param formData - Form data containing draft fields
 * @param draftId - Optional draft ID for updates
 * @returns Success status and draft ID
 */
export async function transferTaskToSprint(
  taskId: string,
  destinationSprintId: string,
  destinationColumnId?: string,
): Promise<{ success: boolean; error?: string }> {
  let supabase: GuardSupabase;
  let user;
  try {
    ({ supabase, user } = await requireUser());
  } catch {
    return { success: false, error: "Unauthorized" };
  }
 
  try {
    // -------------------------------------------------------------------------
    // 1. Fetch the task's current column so we can get the source board/project
    // -------------------------------------------------------------------------
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id, kanban_column_id, title")
      .eq("id", taskId)
      .single();
 
    if (taskError || !task) {
      console.error("Error fetching task:", taskError);
      return { success: false, error: "Task not found." };
    }
 
    const { data: sourceColumn, error: sourceColumnError } = await supabase
      .from("kanban_columns")
      .select("board_id")
      .eq("id", task.kanban_column_id)
      .single();
 
    if (sourceColumnError || !sourceColumn) {
      console.error("Error fetching source column:", sourceColumnError);
      return { success: false, error: "Source column not found." };
    }
 
    const sourceBoardId = sourceColumn.board_id;
 
    // -------------------------------------------------------------------------
    // 2. Fetch the source board's project_id (for permission check + revalidation)
    // -------------------------------------------------------------------------
    const { data: sourceBoard, error: sourceBoardError } = await supabase
      .from("kanban_boards")
      .select("project_id")
      .eq("id", sourceBoardId)
      .single();
 
    if (sourceBoardError || !sourceBoard) {
      console.error("Error fetching source board:", sourceBoardError);
      return { success: false, error: "Source board not found." };
    }
 
    const projectId = sourceBoard.project_id;

    // Only members of the source project (or admins) may transfer its tasks.
    try {
      await assertProjectMembership(supabase, user.id, { found: true, projectId });
    } catch {
      return { success: false, error: "Forbidden" };
    }
 
    // -------------------------------------------------------------------------
    // 3. Fetch the destination sprint and verify it belongs to the same project
    // -------------------------------------------------------------------------
    const { data: destinationSprint, error: sprintError } = await supabase
      .from("kanban_sprints")
      .select("id, board_id, project_id, name")
      .eq("id", destinationSprintId)
      .single();
 
    if (sprintError || !destinationSprint) {
      console.error("Error fetching destination sprint:", sprintError);
      return { success: false, error: "Destination sprint not found." };
    }
 
    if (destinationSprint.project_id !== projectId) {
      return {
        success: false,
        error: "Cannot transfer task to a sprint in a different project.",
      };
    }
 
    const destinationBoardId = destinationSprint.board_id;
 
    // -------------------------------------------------------------------------
    // 4. Resolve the target column on the destination board
    //    - Use provided destinationColumnId if given and valid
    //    - Otherwise fall back to the first column by position
    // -------------------------------------------------------------------------
    let targetColumnId: string | null = null;
 
    if (destinationColumnId) {
      // Verify the provided column actually belongs to the destination board
      const { data: providedColumn, error: providedColumnError } = await supabase
        .from("kanban_columns")
        .select("id")
        .eq("id", destinationColumnId)
        .eq("board_id", destinationBoardId)
        .single();
 
      if (!providedColumnError && providedColumn) {
        targetColumnId = providedColumn.id;
      }
    }
 
    // Fall back: pick the first column by position on the destination board
    if (!targetColumnId) {
      const { data: firstColumn, error: firstColumnError } = await supabase
        .from("kanban_columns")
        .select("id, name")
        .eq("board_id", destinationBoardId)
        .order("position", { ascending: true })
        .limit(1)
        .single();
 
      if (firstColumnError || !firstColumn) {
        return {
          success: false,
          error:
            "The destination sprint's board has no columns. Please add at least one column before transferring.",
        };
      }
 
      targetColumnId = firstColumn.id;
    }
 
    // -------------------------------------------------------------------------
    // 5. Update tasks.kanban_column_id — this is the single source of truth
    // -------------------------------------------------------------------------
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        kanban_column_id: targetColumnId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);
 
    if (updateError) {
      console.error("Error transferring task:", updateError);
      return { success: false, error: updateError.message };
    }
 
    // -------------------------------------------------------------------------
    // 6. Revalidate both boards so changes are visible immediately
    // -------------------------------------------------------------------------
    revalidateKanbanBoardLists(projectId);
 
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in transferTaskToSprint:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to transfer task.",
    };
  }
}

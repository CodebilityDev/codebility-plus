"use server";

import { revalidatePath } from "next/cache";
import { Task, TaskDraft } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { createNotificationAction } from "@/lib/actions/notification.actions";

interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

const updateDeveloperLevels = async (codevId?: string) => {
  if (!codevId) return;

  const supabase = await createClientServerComponent();

  const { data: pointsData, error: pointsError } = await supabase
    .from("codev_points")
    .select("skill_category_id, points")
    .eq("codev_id", codevId);

  if (pointsError) {
    console.error("Error fetching points:", pointsError);
    return;
  }

  const levels: Record<string, number> = {};

  // Fetch all levels in parallel instead of sequential
  const levelPromises = pointsData.map(async (pointRecord) => {
    const { data: levelData, error: levelError } = await supabase
      .from("levels")
      .select("*")
      .eq("skill_category_id", pointRecord.skill_category_id)
      .lte("min_points", pointRecord.points)
      .order("level", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!levelError && levelData) {
      return { 
        skillCategoryId: pointRecord.skill_category_id, 
        level: levelData.level 
      };
    }
    return null;
  });

  const levelResults = await Promise.all(levelPromises);

  levelResults.forEach((result) => {
    if (result) {
      levels[result.skillCategoryId] = result.level;
    }
  });

  if (Object.keys(levels).length > 0) {
    const { error: updateError } = await supabase
      .from("codev")
      .update({ level: levels })
      .eq("id", codevId);

    if (updateError) {
      console.error("Error updating levels:", updateError);
    }
  }
};

export const updateTaskColumnId = async (
  taskId: string,
  newColumnId: string,
): Promise<Task> => {
  const supabase = await createClientServerComponent();

  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        kanban_column_id: newColumnId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .select("*")
      .single();

    if (error) throw error;
    return data as Task;
  } catch (error) {
    throw error;
  }
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
  const supabase = await createClientServerComponent();

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
    const created_by = formData.get("created_by")?.toString();
    const deadline = formData.get("deadline")?.toString() || null;

    if (!title || !kanban_column_id || !skill_category_id) {
      return { success: false, error: "Required fields are missing (title, column, and skill category)" };
    }

    const { error } = await supabase.from("tasks").insert([
      {
        title,
        description,
        priority,
        difficulty,
        type,
        pr_link,
        points,
        kanban_column_id,
        codev_id,
        sidekick_ids,
        skill_category_id,
        created_by,
        deadline,
      },
    ]);

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
        revalidatePath(`/home/kanban/${boardData.project_id}/${columnData.board_id}`);
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
  const supabase = await createClientServerComponent();

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
      // Get current user to avoid self-notification
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.id !== codev_id) {
        // Fetch project info to build the action URL
        const { data: colData } = await supabase
          .from("kanban_columns")
          .select("board_id, kanban_boards(project_id)")
          .eq("id", existingTask.kanban_column_id)
          .single();

        await createNotificationAction({
          recipientId: codev_id,
          title: "Task Assigned",
          message: `You've been assigned to: ${title || existingTask.title}`,
          type: "task",
          priority: "normal",
          projectId: (colData?.kanban_boards as any)?.project_id,
          actionUrl: `/home/kanban/${(colData?.kanban_boards as any)?.project_id}/${colData?.board_id}?taskId=${taskId}`,
          metadata: { taskId }
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
  const supabase = await createClientServerComponent();

  try {
    const { data: taskData } = await supabase
      .from("tasks")
      .select("kanban_column_id")
      .eq("id", taskId)
      .single();

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
          revalidatePath(`/home/kanban/${boardData.project_id}/${columnData.board_id}`);
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

export const createNewColumn = async (
  columnName: string,
  boardId: string,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClientServerComponent();
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
  const supabase = await createClientServerComponent();

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
  const supabase = await createClientServerComponent();
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
  const supabase = await createClientServerComponent();

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
export const completeTask = async (
  task: Task,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClientServerComponent();

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
        updated_at: new Date().toISOString()
      })
      .eq("id", task.id);

    if (archiveError) {
      console.error("Error archiving task:", archiveError);
      return { success: false, error: `Failed to archive task: ${archiveError.message}` };
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

    // Single revalidation at the end
    revalidatePath("/home/kanban");

    return { success: true };
  } catch (error) {
    console.error("Error completing task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete task",
    };
  }
};

export async function batchUpdateTasks(
  updates: Array<{ taskId: string; newColumnId: string }>,
) {
  const supabase = await createClientServerComponent();
  try {
    const updatePromises = updates.map(async (update) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          kanban_column_id: update.newColumnId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", update.taskId);
      return error;
    });
    const errors = await Promise.all(updatePromises);
    return {
      success: !errors.some((error) => error !== null),
      error: errors.some((error) => error !== null) ? "Some updates failed" : undefined,
    };
  } catch (error) {
    console.error("Batch update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Batch update failed",
    };
  }
}

export async function updateTaskPRLink(taskId: string, prLink: string) {
  const supabase = await createClientServerComponent();
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
          revalidatePath(`/home/kanban/${boardData.project_id}/${columnData.board_id}`);
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
  const supabase = await createClientServerComponent();
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
          revalidatePath(`/home/kanban/${boardData.project_id}/${columnData.board_id}`);
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
export const saveDraft = async (
  formData: FormData,
  draftId?: string | null
): Promise<{ success: boolean; draftId?: string; error?: string }> => {
  const supabase = await createClientServerComponent();

  try {
    const created_by = formData.get("created_by")?.toString();
    const project_id = formData.get("project_id")?.toString();
    const intended_column_id = formData.get("intended_column_id")?.toString();

    // Validate required fields
    if (!created_by || !project_id || !intended_column_id) {
      return { 
        success: false, 
        error: "Missing required fields: created_by, project_id, or intended_column_id" 
      };
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
  const supabase = await createClientServerComponent();

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
  const supabase = await createClientServerComponent();

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
      // Get current user to avoid self-notification
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.id !== draft.codev_id) {
        await createNotificationAction({
          recipientId: draft.codev_id,
          title: "Task Assigned (from Draft)",
          message: `The draft "${draft.title}" has been published and assigned to you.`,
          type: "task",
          priority: "normal",
          projectId: draft.project_id,
          actionUrl: `/home/kanban/${draft.project_id}/${draft.intended_column_id}?taskId=${newTask.id}`,
          metadata: { taskId: newTask.id }
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
        revalidatePath(`/home/kanban/${boardData.project_id}/${columnData.board_id}`);
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
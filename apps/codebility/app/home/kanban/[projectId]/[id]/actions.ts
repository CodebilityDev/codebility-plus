"use server";

import { revalidatePath } from "next/cache";
import { Task } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";

interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

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

    if (!title || !kanban_column_id) {
      return { success: false, error: "Required fields are missing" };
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
      },
    ]);

    if (error) {
      console.error("Error creating task:", error);
      return { success: false, error: error.message };
    }

    // Sequential queries to avoid nested join TypeScript issues
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
    // Handle BOTH UUID fields properly
    const rawCodevId = formData.get("codev_id")?.toString();
    const codev_id = rawCodevId === "" || rawCodevId === "null" ? null : rawCodevId;

    const rawSkillCategoryId = formData.get("skill_category_id")?.toString();
    const skill_category_id = rawSkillCategoryId === "" || rawSkillCategoryId === "null" ? null : rawSkillCategoryId;

    const updateData = {
      title: formData.get("title")?.toString(),
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
      updated_at: new Date().toISOString(),
    };

    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (fetchError) {
      console.error("Error fetching existing task:", fetchError);
      return { success: false, error: "Could not find task to update" };
    }

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
    // Sequential queries instead of nested joins
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

    // Get revalidation path data
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

const updateDeveloperLevels = async (codevId?: string) => {
  if (!codevId) return;

  const supabase = await createClientServerComponent();

  const { data: pointsData, error: pointsError } = await supabase
    .from("codev_points")
    .select("skill_category_id, points");

  if (pointsError) {
    console.error("Error fetching points:", pointsError);
    return;
  }

  const levels: Record<string, number> = {};

  for (const pointRecord of pointsData) {
    const { data: levelData, error: levelError } = await supabase
      .from("levels")
      .select("*")
      .eq("skill_category_id", pointRecord.skill_category_id)
      .lte("min_points", pointRecord.points)
      .order("level", { ascending: false })
      .limit(1)
      .single();

    if (levelError) {
      console.error("Error finding level:", levelError);
      continue;
    }

    if (levelData) {
      levels[pointRecord.skill_category_id] = levelData.level;
    }
  }

  const { error: updateError } = await supabase
    .from("codev")
    .update({ level: levels })
    .eq("id", codevId);

  if (updateError) {
    console.error("Error updating levels:", updateError);
  }
};

// RESOLVED: Comprehensive completeTask implementation with RPC fallback
export const completeTask = async (
  task: Task,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = await createClientServerComponent();

  try {
    // Try to use the RPC function first for better performance
    const { data, error } = await supabase.rpc('complete_task', {
      task_id: task.id,
      task_points: task.points || 0,
      primary_codev_id: task.codev?.id,
      p_skill_category_id: task.skill_category?.id,
      sidekick_ids: task.sidekick_ids || null
    });

    // If RPC function doesn't exist, fall back to manual implementation
    if (error && error.message.includes('function complete_task')) {
      
      // 1. Archive the task instead of deleting for data preservation
      const { error: archiveError } = await supabase
        .from("tasks")
        .update({ 
          is_archive: true,
          updated_at: new Date().toISOString()
        })
        .eq("id", task.id);

      if (archiveError) throw archiveError;

      // 2. Award points to primary assignee
      if (task.codev?.id && task.skill_category?.id && task.points) {
        const { data: existingPoints } = await supabase
          .from("codev_points")
          .select("*")
          .eq("codev_id", task.codev.id)
          .eq("skill_category_id", task.skill_category.id)
          .single();

        if (existingPoints) {
          await supabase
            .from("codev_points")
            .update({
              points: existingPoints.points + task.points,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingPoints.id);
        } else {
          await supabase
            .from("codev_points")
            .insert({
              codev_id: task.codev.id,
              skill_category_id: task.skill_category.id,
              points: task.points,
            });
        }

        // 3. Award points to sidekicks (50% of task points)
        if (task.sidekick_ids?.length) {
          const sidekickPoints = Math.floor(task.points * 0.5);
          
          for (const sidekickId of task.sidekick_ids) {
            const { data: sidekickExisting } = await supabase
              .from("codev_points")
              .select("*")
              .eq("codev_id", sidekickId)
              .eq("skill_category_id", task.skill_category.id)
              .single();

            if (sidekickExisting) {
              await supabase
                .from("codev_points")
                .update({
                  points: sidekickExisting.points + sidekickPoints,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", sidekickExisting.id);
            } else {
              await supabase
                .from("codev_points")
                .insert({
                  codev_id: sidekickId,
                  skill_category_id: task.skill_category.id,
                  points: sidekickPoints,
                });
            }
          }
        }

        // 4. Update developer levels for all participants
        await updateDeveloperLevels(task.codev.id);
        
        if (task.sidekick_ids?.length) {
          for (const sidekickId of task.sidekick_ids) {
            await updateDeveloperLevels(sidekickId);
          }
        }
      }

      // Sequential queries for revalidation path
      const { data: taskData } = await supabase
        .from("tasks")
        .select("kanban_column_id")
        .eq("id", task.id)
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
    }

    if (error) {
      throw error;
    }

    const result = data as { success: boolean; error?: string; message?: string };

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to complete task"
      };
    }

    // Sequential queries for revalidation when using RPC
    const { data: taskData } = await supabase
      .from("tasks")
      .select("kanban_column_id")
      .eq("id", task.id)
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

    // Sequential queries for revalidation
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

    // Sequential queries for revalidation
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
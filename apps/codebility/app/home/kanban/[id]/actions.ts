"use server";

import { revalidatePath } from "next/cache";
import { Task } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
  const supabase = createClientComponentClient();

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
  boardId: string,
): Promise<CodevMember[]> => {
  const supabase = createClientComponentClient();

  // 1. Get the project_id from the kanban_boards table.
  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", boardId)
    .single();

  if (boardError || !board?.project_id) {
    console.error("No project associated with this board");
    return [];
  }

  // 2. Get all project members from project_members table.
  const { data: projectMembers, error: projectMembersError } = await supabase
    .from("project_members")
    .select("codev_id, role")
    .eq("project_id", board.project_id);

  if (projectMembersError || !projectMembers?.length) {
    console.error(
      "Error fetching project members:",
      projectMembersError?.message,
    );
    return [];
  }

  // 3. Separate team leader and members
  let teamLeaderId: string | null = null;
  let memberIds: string[] = [];

  projectMembers.forEach((member) => {
    if (member.role === "team_leader") {
      teamLeaderId = member.codev_id;
    } else {
      memberIds.push(member.codev_id);
    }
  });

  // 4. Fetch team members' details from the codev table
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

  // 5. Fetch the team leader details (if exists)
  if (teamLeaderId) {
    const { data: leaderData, error: leaderError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, availability_status")
      .eq("id", teamLeaderId)
      .single();

    if (leaderError) {
      console.error("Error fetching project leader:", leaderError.message);
    } else if (leaderData.availability_status === true) {
      members.unshift(leaderData); // Add leader to the beginning of the list
    }
  }

  return members.sort((a, b) => a.first_name.localeCompare(b.first_name));
};

export const createNewTask = async (
  formData: FormData,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClientComponentClient();

  try {
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const priority = formData.get("priority")?.toString();
    const difficulty = formData.get("difficulty")?.toString();
    const type = formData.get("type")?.toString()?.toUpperCase(); // Ensure type is uppercase (or adjust to your DB requirement)
    const pr_link = formData.get("pr_link")?.toString();
    const points = formData.get("points")
      ? Number(formData.get("points"))
      : null;
    const kanban_column_id = formData.get("kanban_column_id")?.toString();
    const codev_id = formData.get("codev_id")?.toString(); // primary assignee
    const sidekick_ids = formData
      .get("sidekick_ids")
      ?.toString()
      .split(",")
      .filter(Boolean);
    const skill_category_id = formData.get("skill_category_id")?.toString(); // NEW field

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
        skill_category_id, // NEW field inserted into the DB
      },
    ]);

    if (error) {
      console.error("Error creating task:", error);
      return { success: false, error: error.message };
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
  const supabase = createClientComponentClient();

  try {
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
        : [], // Ensure it's always an array
      skill_category_id: formData.get("skill_category_id")?.toString(),
      codev_id: formData.get("codev_id")?.toString(),
      updated_at: new Date().toISOString(),
    };

    // First, validate that we can actually read the task
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (fetchError) {
      console.error("Error fetching existing task:", fetchError);
      return { success: false, error: "Could not find task to update" };
    }

    // Then perform the update
    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        ...updateData,
        sidekick_ids: updateData.sidekick_ids, // Explicitly set as array
      })
      .eq("id", taskId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return { success: false, error: updateError.message };
    }

    // Verify the update
    const { data: updatedTask, error: verifyError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (verifyError) {
      console.error("Error verifying update:", verifyError);
      return { success: false, error: "Could not verify update" };
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
  const supabase = createClientComponentClient();

  try {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/kanban");
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
  const supabase = createClientComponentClient();

  try {
    // Fix the type for the select query
    const { data: existingColumns, error: queryError } = await supabase
      .from("kanban_columns")
      .select("position") // Remove the type generics, just use string
      .eq("board_id", boardId)
      .order("position", { ascending: false })
      .limit(1);

    if (queryError) {
      return { success: false, error: queryError.message };
    }

    // Safely type the next position
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
  const supabase = createClientComponentClient();

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
      error:
        error instanceof Error
          ? error.message
          : "Failed to update column position",
    };
  }
};

export const deleteColumn = async (
  columnId: string,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClientComponentClient();

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
  const supabase = createClientComponentClient();

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
      error:
        error instanceof Error ? error.message : "Failed to update column name",
    };
  }
};

const updateDeveloperLevels = async (codevId?: string) => {
  if (!codevId) return;

  const supabase = createClientComponentClient();

  // 1. Get all points for this developer across skill categories
  const { data: pointsData, error: pointsError } = await supabase
    .from("codev_points")
    .select("skill_category_id, points");

  if (pointsError) {
    console.error("Error fetching points:", pointsError);
    return;
  }

  // 2. Prepare levels object
  const levels: Record<string, number> = {};

  // 3. For each skill category, determine the level
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

  // 4. Update codev table's level column
  const { error: updateError } = await supabase
    .from("codev")
    .update({ level: levels })
    .eq("id", codevId);

  if (updateError) {
    console.error("Error updating levels:", updateError);
  }
};

export const completeTask = async (
  task: Task,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClientComponentClient();

  try {
    // 1. Get primary assignee points record
    const { data: existingPoints, error: pointsError } = await supabase
      .from("codev_points")
      .select("*")
      .eq("codev_id", task.codev?.id)
      .eq("skill_category_id", task.skill_category?.id)
      .single();

    // 2. Calculate new points
    const taskPoints = task.points || 0;
    const currentPoints = existingPoints?.points || 0;
    const newPoints = currentPoints + taskPoints;

    // 3. Update or insert points for primary assignee
    if (existingPoints) {
      const { error: updateError } = await supabase
        .from("codev_points")
        .update({
          points: newPoints,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingPoints.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("codev_points")
        .insert({
          codev_id: task.codev?.id,
          skill_category_id: task.skill_category?.id,
          points: taskPoints,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;
    }

    // 4. Handle sidekick points (50% of task points)
    if (task.sidekick_ids?.length) {
      const sidekickPoints = Math.floor(taskPoints * 0.5);

      for (const sidekickId of task.sidekick_ids) {
        const { data: sidekickExistingPoints, error: sidekickError } =
          await supabase
            .from("codev_points")
            .select("*")
            .eq("codev_id", sidekickId)
            .eq("skill_category_id", task.skill_category?.id)
            .single();

        if (sidekickError && sidekickError.code !== "PGRST116") {
          throw sidekickError;
        }

        if (sidekickExistingPoints) {
          const { error: updateError } = await supabase
            .from("codev_points")
            .update({
              points: sidekickExistingPoints.points + sidekickPoints,
              updated_at: new Date().toISOString(),
            })
            .eq("id", sidekickExistingPoints.id);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("codev_points")
            .insert({
              codev_id: sidekickId,
              skill_category_id: task.skill_category?.id,
              points: sidekickPoints,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
            });

          if (insertError) throw insertError;
        }
      }
    }

    // 5. Update developer levels
    await updateDeveloperLevels(task.codev?.id);

    // 6. Delete the task
    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", task.id);

    if (deleteError) throw deleteError;

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
  const supabase = createClientComponentClient();
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
      error: errors.some((error) => error !== null)
        ? "Some updates failed"
        : undefined,
    };
  } catch (error) {
    console.error("Batch update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Batch update failed",
    };
  }
}

// for updating the pr_link
export async function updateTaskPRLink(taskId: string, prLink: string) {
  const supabase = createClientComponentClient();
  try {
    const { error } = await supabase
      .from("tasks")
      .update({ pr_link: prLink, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating PR link:", error);
      return { success: false, error: error.message };
    }

    // ✅ Revalidate the cache after updating
    revalidatePath("/home/kanban");

    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}

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

  // 1. Get the project_id from the kanban board.
  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", boardId)
    .single();

  if (boardError || !board?.project_id) {
    console.error("No project associated with this board");
    return [];
  }

  // 2. Fetch project details, including team_leader_id and members (assumed to be an array of codev IDs).
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("team_leader_id, members")
    .eq("id", board.project_id)
    .single();

  if (projectError) {
    console.error("Error fetching project details:", projectError.message);
    return [];
  }

  // 3. Initialize the array for available members.
  let members: CodevMember[] = [];

  // Check if the project has a members array and query the codev table for these IDs.
  if (
    project.members &&
    Array.isArray(project.members) &&
    project.members.length > 0
  ) {
    const { data: codevMembers, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, availability_status")
      .in("id", project.members);

    if (codevError) {
      console.error("Error fetching project members:", codevError.message);
    } else if (codevMembers) {
      members = codevMembers
        .filter((member: any) => member.availability_status === true)
        .map((member: any) => ({
          id: member.id,
          first_name: member.first_name,
          last_name: member.last_name,
          image_url: member.image_url,
        }));
    }
  }

  // 4. Ensure the project leader is included if available and not already in the list.
  if (
    project.team_leader_id &&
    !members.some((m) => m.id === project.team_leader_id)
  ) {
    const { data: leaderData, error: leaderError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, availability_status")
      .eq("id", project.team_leader_id)
      .single();

    if (leaderError) {
      console.error(
        "Error fetching project leader details:",
        leaderError.message,
      );
    } else if (leaderData && leaderData.availability_status === true) {
      members.push({
        id: leaderData.id,
        first_name: leaderData.first_name,
        last_name: leaderData.last_name,
        image_url: leaderData.image_url,
      });
    }
  }

  // 5. Sort members by first name before returning.
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

    if (!title || !kanban_column_id || !codev_id) {
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

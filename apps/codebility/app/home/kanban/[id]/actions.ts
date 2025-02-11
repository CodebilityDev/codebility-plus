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

  const { data, error } = await supabase
    .from("tasks")
    .update({ kanban_column_id: newColumnId, updated_at: new Date() })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update task column ID.");
  }

  return data as Task;
};

export const updateTasksQueue = async (tasks: Task[]): Promise<void> => {
  const supabase = createClientComponentClient();

  for (const task of tasks) {
    const { error } = await supabase
      .from("tasks")
      .update({ updated_at: new Date() })
      .eq("id", task.id);

    if (error) {
      throw new Error(error.message || "Failed to update task.");
    }
  }
};

export const fetchAvailableMembers = async (
  boardId: string,
): Promise<CodevMember[]> => {
  const supabase = createClientComponentClient();

  // First, get the project_id from the kanban board.
  const { data: board } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", boardId)
    .single();

  if (!board?.project_id) {
    console.log("No project associated with this board");
    return [];
  }

  // Fetch project members (available ones) using the project_id.
  const { data: projectMembers, error } = await supabase
    .from("project_members")
    .select(
      `
      codev (
        id,
        first_name,
        last_name,
        image_url,
        availability_status
      )
    `,
    )
    .eq("project_id", board.project_id)
    .eq("codev.availability_status", true);

  if (error) {
    console.error("Error fetching project members:", error.message);
    return [];
  }

  // Process members from project_members table.
  const members: CodevMember[] = (projectMembers || [])
    .filter((pm: any) => pm.codev)
    .map((pm: any) => ({
      id: pm.codev.id,
      first_name: pm.codev.first_name,
      last_name: pm.codev.last_name,
      image_url: pm.codev.image_url,
    }));

  // Now, fetch the project leader from the projects table.
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("team_leader_id")
    .eq("id", board.project_id)
    .single();

  if (projectError) {
    console.error("Error fetching project leader:", projectError.message);
  } else if (project && project.team_leader_id) {
    // Fetch the project leader's details from the codev table.
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
      // Map the leader to CodevMember.
      const leaderMember: CodevMember = {
        id: leaderData.id,
        first_name: leaderData.first_name,
        last_name: leaderData.last_name,
        image_url: leaderData.image_url,
      };
      // Add the leader if not already in the members list.
      if (!members.some((m) => m.id === leaderMember.id)) {
        members.push(leaderMember);
      }
    }
  }

  // Sort members by first name before returning.
  return members.sort((a, b) => a.first_name.localeCompare(b.first_name));
};

export const fetchSidekickMembers = async (
  sidekickIds: string[],
): Promise<CodevMember[]> => {
  const supabase = createClientComponentClient();

  if (sidekickIds.length === 0) return [];

  const { data, error } = await supabase
    .from("codev")
    .select("id, first_name, last_name, image_url")
    .in("id", sidekickIds);

  if (error) {
    console.error("Error fetching sidekick members:", error.message);
    return [];
  }

  return data as CodevMember[];
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
    // Extract data from FormData
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const priority = formData.get("priority")?.toString();
    const difficulty = formData.get("difficulty")?.toString();
    const type = formData.get("type")?.toString();
    const pr_link = formData.get("pr_link")?.toString();
    const points = formData.get("points")
      ? Number(formData.get("points"))
      : null;
    const sidekick_ids = formData
      .get("sidekick_ids")
      ?.toString()
      .split(",")
      .filter(Boolean);
    const skill_category_id = formData.get("skill_category_id")?.toString(); // NEW field

    if (!title) {
      return { success: false, error: "Title is required" };
    }

    // Update task in database
    const { error } = await supabase
      .from("tasks")
      .update({
        title,
        description,
        priority,
        difficulty,
        type,
        pr_link,
        points,
        sidekick_ids,
        skill_category_id, // NEW field updated in the DB
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error.message);
      return { success: false, error: error.message };
    }

    // Revalidate the path to refresh the data
    revalidatePath("/home/kanban");
    return { success: true };
  } catch (error) {
    console.error("Error updating task:", error);
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
  "use client";

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

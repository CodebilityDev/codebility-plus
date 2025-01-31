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

export const fetchAvailableMembers = async (): Promise<CodevMember[]> => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from("codev")
    .select("id, first_name, last_name, image_url")
    .eq("availability_status", true)
    .order("first_name");

  if (error) {
    console.error("Error fetching members:", error.message);
    return [];
  }

  return data || [];
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
    const type = formData.get("type")?.toString();
    const pr_link = formData.get("pr_link")?.toString();
    const points = formData.get("points")
      ? Number(formData.get("points"))
      : null;
    const kanban_column_id = formData.get("kanban_column_id")?.toString();
    const sidekick_ids = formData
      .get("sidekick_ids")
      ?.toString()
      .split(",")
      .filter(Boolean);

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
        sidekick_ids,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Error creating task:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/home/kanban");
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
  kanbanBoardId: string,
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClientComponentClient();

  try {
    const { error } = await supabase.from("kanban_columns").insert([
      {
        name: columnName,
        kanban_board_id: kanbanBoardId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error creating column:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/home/kanban/${kanbanBoardId}`);
    return { success: true };
  } catch (error) {
    console.error("Unexpected error creating column:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

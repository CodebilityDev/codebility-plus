"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { revalidatePath } from "next/cache";

export async function createNewSprint(formData: FormData) {
  const supabase = getSupabaseServerActionClient();

  const projectId = formData.get("projectId") as string;
  const startAt = formData.get("startAt") as string;
  const endAt = formData.get("endAt") as string;

  if (!projectId || !startAt || !endAt) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    // Fetch the current sprint count for the project
    const { count, error: countError } = await supabase
      .from("kanban_sprints")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId);

    if (countError) {
      console.error("Error fetching sprint count:", countError);
      return { success: false, error: "Failed to generate sprint name" };
    }

    // Generate sprint name (e.g., Sprint 1, Sprint 2, etc.)
    const sprintName = `Sprint ${count! + 1}`;

    // Insert the new sprint
    // TODO: Also add creating a new board for the sprint
    const { data, error } = await supabase
      .from("kanban_sprints")
      .insert({
        board_id: null,
        project_id: projectId,
        name: sprintName,
        start_at: startAt,
        end_at: endAt,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    // Revalidate the KanbanSprintPage to refresh the sprints list
    revalidatePath(`/kanban/${projectId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Failed to create sprint" };
  }
}

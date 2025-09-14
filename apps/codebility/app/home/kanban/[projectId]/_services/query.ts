"use server"

import { createClientServerComponent } from "@/utils/supabase/server";

export const getSprintsData = async (projectId: String) => {
  try {
    const supabase = await createClientServerComponent();
  
      // Fetch project + sprints
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          id,
          name,
          kanban_sprints!kanban_sprints_project_id_fkey (
            id,
            name,
            start_at,
            end_at,
            project_id,
            board_id,
            kanban_board:kanban_boards!kanban_sprints_board_id_fkey (
              id,
              name
            )
          )
        `,
        )
        .eq("id", projectId)
        .single();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
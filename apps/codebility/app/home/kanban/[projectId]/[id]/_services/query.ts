"use server"

import { createClientServerComponent } from "@/utils/supabase/server";

export const getBoardData = async (boardId: String) => {
  try {
    const supabase = await createClientServerComponent();
  
    const { data: boardData, error } = await supabase
    .from("kanban_boards")
    .select(
      `
      id,
      name,
      description,
      created_at,
      updated_at,
      project_id,
      kanban_columns (
        id,
        name,
        position,
        created_at,
        updated_at,
        tasks (
          id,
          title,
          description,
          priority,
          difficulty,
          type,
          due_date,
          points,
          pr_link,
          sidekick_ids,
          created_by,
          kanban_column_id,
          is_archive,
          codev!tasks_codev_id_fkey (
            id,
            first_name,
            last_name,
            image_url
          ),
          skill_category!tasks_skill_category_id_fkey (
            id,
            name
          )
        )
      )
    `,
    )
    .eq("id", boardId)
    .single();

    if (error) throw error;

    return boardData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
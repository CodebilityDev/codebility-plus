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
        updated_at
      )
    `,
    )
    .eq("id", boardId)
    .single();

    if (error) throw error;

    // Fetch tasks separately with proper filtering
    if (boardData?.kanban_columns) {
      const columnIds = boardData.kanban_columns.map((col: any) => col.id);
      
      const { data: tasks, error: tasksError } = await supabase
        .from("tasks")
        .select(`
          id,
          title,
          description,
          priority,
          difficulty,
          type,
          due_date,
          deadline,
          points,
          pr_link,
          sidekick_ids,
          created_by,
          kanban_column_id,
          is_archive,
          created_at,
          updated_at,
          skill_category_id,
          codev_id,
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
        `)
        .in("kanban_column_id", columnIds)
        .eq("is_archive", false)
        .order("created_at", { ascending: true });

      if (tasksError) throw tasksError;

      // Attach tasks to their respective columns
      boardData.kanban_columns = boardData.kanban_columns.map((column: any) => ({
        ...column,
        tasks: tasks?.filter((task: any) => task.kanban_column_id === column.id) || []
      }));
    }

    if (error) throw error;

    return boardData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
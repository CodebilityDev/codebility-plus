"use server"

import { createClientServerComponent } from "@/utils/supabase/server";

export const getBoardData = async (boardId: String) => {
  try {
    const supabase = await createClientServerComponent();

    // Fetch the board and its columns
    const { data: boardData, error } = await supabase
      .from("kanban_boards")
      .select(`
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
      `)
      .eq("id", boardId)
      .single();

    if (error) throw error;

    if (boardData?.kanban_columns) {
      const columnIds = boardData.kanban_columns.map((col: any) => col.id);

      // Fetch tasks
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
        // BUG FIX: Filter out archived tasks (handles NULL, true, false)
        // Use .or() to exclude both NULL and true values
        .or("is_archive.is.null,is_archive.eq.false")
        .order("created_at", { ascending: true });

      if (tasksError) throw tasksError;

      // Fetch ticket codes separately
      const taskIds = tasks?.map((task: any) => task.id) || [];
      const { data: ticketCodes, error: ticketError } = await supabase
        .from("task_ticket_codes")
        .select(`task_id, ticket_code`)
        .in("task_id", taskIds);

      if (ticketError) throw ticketError;

      // Merge ticket_code into tasks
      const tasksWithTicket = tasks?.map((task: any) => ({
        ...task,
        ticket_code: ticketCodes?.find((t: any) => t.task_id === task.id)?.ticket_code || null,
      }));

      // Attach tasks to their respective columns
      boardData.kanban_columns = boardData.kanban_columns.map((column: any) => ({
        ...column,
        tasks: tasksWithTicket?.filter((task: any) => task.kanban_column_id === column.id) || [],
      }));
    } else {
      // If no columns exist, initialize empty tasks array
      boardData.kanban_columns = boardData.kanban_columns?.map((column: any) => ({
        ...column,
        tasks: []
      })) || [];
    }
    
    return boardData;
  } catch (error) {
    console.error("Error fetching board data:", error);
    throw error;
  }
};

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

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching sprints data:", error);
    throw error;
  }
};

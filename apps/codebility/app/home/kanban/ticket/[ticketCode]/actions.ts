"use server";

import { createClientServerComponent } from "@/utils/supabase/server";

interface GetTaskDetailsResult {
  success: boolean;
  error?: string;
  data?: {
    project_id: string;
    board_id: string;
    task_id: string;
  };
}

export const getTaskDetailsByTicketCode = async (
  ticket_code: string
): Promise<GetTaskDetailsResult> => {
  const supabase = await createClientServerComponent();

  if (!ticket_code) {
    return { success: false, error: "Ticket code is required" };
  }

  // 1️⃣ Get task_id from task_ticket_codes
  const { data: taskTicket, error: taskTicketError } = await supabase
    .from("task_ticket_codes")
    .select("task_id")
    .eq("ticket_code", ticket_code)
    .single();

  if (taskTicketError || !taskTicket) {
    return { success: false, error: taskTicketError?.message || "Ticket not found" };
  }

  const task_id = taskTicket.task_id;

  // 2️⃣ Get kanban_column_id from tasks
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("kanban_column_id")
    .eq("id", task_id)
    .single();

  if (taskError || !task) {
    return { success: false, error: taskError?.message || "Task not found" };
  }

  const kanban_column_id = task.kanban_column_id;

  // 3️⃣ Get board_id and project_id from kanban_columns
  const { data: column, error: columnError } = await supabase
    .from("kanban_columns")
    .select("board_id")
    .eq("id", kanban_column_id)
    .single();

  if (columnError || !column) {
    return { success: false, error: columnError?.message || "Column not found" };
  }

  const board_id = column.board_id;

  // 4️⃣ Get project_id from kanban_boards
  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", board_id)
    .single();

  if (boardError || !board) {
    return { success: false, error: boardError?.message || "Board not found" };
  }

  const project_id = board.project_id;

  return {
    success: true,
    data: { task_id, board_id, project_id },
  };
};

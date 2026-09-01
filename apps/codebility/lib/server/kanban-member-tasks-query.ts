import type { SupabaseClient } from "@supabase/supabase-js";

import { KANBAN_BOARD_TASK_SELECT } from "@/lib/kanban/board-task-select";
import { mapTaskSummary } from "@/lib/kanban/board-mappers";
import { Task } from "@/types/home/codev";

export async function fetchMemberBoardTasks(
  supabase: SupabaseClient,
  boardId: string,
  memberId: string,
): Promise<Task[]> {
  const { data: columns, error: columnsError } = await supabase
    .from("kanban_columns")
    .select("id")
    .eq("board_id", boardId);

  if (columnsError) {
    console.error("Error fetching board columns for member filter:", columnsError);
    throw columnsError;
  }

  if (!columns?.length) {
    return [];
  }

  const columnIds = columns.map((column) => column.id);

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(KANBAN_BOARD_TASK_SELECT)
    .in("kanban_column_id", columnIds)
    .or("is_archive.is.null,is_archive.eq.false")
    .or(`codev_id.eq.${memberId},sidekick_ids.cs.{${memberId}}`)
    .order("position", { ascending: true });

  if (tasksError) {
    console.error("Error fetching member board tasks:", tasksError);
    throw tasksError;
  }

  return (tasks ?? []).map((task) =>
    mapTaskSummary(task as Record<string, unknown>),
  );
}

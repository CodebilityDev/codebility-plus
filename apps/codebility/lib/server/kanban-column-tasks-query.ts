import type { SupabaseClient } from "@supabase/supabase-js";

import { mapTaskSummary } from "@/lib/kanban/board-mappers";
import { KANBAN_BOARD_TASK_SELECT } from "@/lib/kanban/board-task-select";
import { Task } from "@/types/home/codev";

const ACTIVE_TASKS_FILTER = "is_archive.is.null,is_archive.eq.false";

export async function fetchColumnTaskCount(
  supabase: SupabaseClient,
  columnId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("kanban_column_id", columnId)
    .or(ACTIVE_TASKS_FILTER);

  if (error) {
    console.error("Error counting column tasks:", error);
    throw error;
  }

  return count ?? 0;
}

export async function fetchColumnTasksPage(
  supabase: SupabaseClient,
  columnId: string,
  offset: number,
  limit: number,
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(KANBAN_BOARD_TASK_SELECT)
    .eq("kanban_column_id", columnId)
    .or(ACTIVE_TASKS_FILTER)
    .order("position", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching column tasks page:", error);
    throw error;
  }

  return (data ?? []).map((task) =>
    mapTaskSummary(task as Record<string, unknown>),
  );
}

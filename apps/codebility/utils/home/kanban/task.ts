import type { Database } from "@/types/global/supabase";
import type { KanbanTask } from "@/types/home/kanban/kanban";

export function toKanbanTask(
  row: Database["public"]["Tables"]["tasks"]["Row"],
): KanbanTask | null {
  if (!row.kanban_column_id || row.is_archive) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    columnId: row.kanban_column_id,
    position: row.position,
    priority: row.priority,
    codevId: row.codev_id,
    dueDate: row.due_date,
    updatedAt: row.updated_at,
    difficulty: row.difficulty,
    points: row.points,
    type: row.type,
    skillCategoryId: row.skill_category_id,
    deadline: row.deadline,
    sidekickIds: row.sidekick_ids ?? [],
  };
}

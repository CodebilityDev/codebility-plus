import {
  KanbanBoardType,
  KanbanColumnType,
  Task,
} from "@/types/home/codev";

import type { ColumnLoadMeta } from "@/lib/kanban/column-load-meta";

export type KanbanBoardWithColumns = KanbanBoardType & {
  project_id?: string;
  kanban_columns: KanbanColumnType[];
  columnLoadMeta?: Record<string, ColumnLoadMeta>;
};

export const mapTaskSummary = (task: Record<string, unknown>): Task => ({
  id: String(task.id),
  title: task.title as string,
  priority: task.priority as string | undefined,
  difficulty: task.difficulty as string | undefined,
  type: task.type as string | undefined,
  deadline: task.deadline as string | undefined,
  kanban_column_id: task.kanban_column_id as string | undefined,
  codev_id: task.codev_id as string | undefined,
  sidekick_ids: task.sidekick_ids as string[] | undefined,
  points: task.points as number | undefined,
  position: (task.position as number | undefined) ?? 0,
  codev: task.codev as Task["codev"],
  skill_category: task.skill_category as Task["skill_category"],
  created_at: "",
});

export const mapTask = (task: Record<string, unknown>): Task => ({
  id: String(task.id),
  title: task.title as string,
  description: task.description as string | undefined,
  priority: task.priority as string | undefined,
  difficulty: task.difficulty as string | undefined,
  type: task.type as string | undefined,
  due_date: task.due_date as string | undefined,
  deadline: task.deadline as string | undefined,
  kanban_column_id: task.kanban_column_id as string | undefined,
  codev_id: task.codev_id as string | undefined,
  created_by: task.created_by as string | undefined,
  sidekick_ids: task.sidekick_ids as string[] | undefined,
  points: task.points as number | undefined,
  is_archive: task.is_archive as boolean | undefined,
  pr_link: task.pr_link as string | undefined,
  created_at: task.created_at as string,
  updated_at: task.updated_at as string | undefined,
  skill_category_id: task.skill_category_id as string | undefined,
  position: (task.position as number | undefined) ?? 0,
  codev: task.codev as Task["codev"],
  skill_category: task.skill_category as Task["skill_category"],
  ticket_code: (task.ticket_code as string | null | undefined) ?? undefined,
});

export const mapColumn = (column: Record<string, unknown>): KanbanColumnType => ({
  id: String(column.id),
  board_id: column.board_id as string | undefined,
  name: column.name as string,
  position: column.position as number,
  created_at: column.created_at as string | undefined,
  updated_at: column.updated_at as string | undefined,
  tasks: Array.isArray(column.tasks)
    ? column.tasks
        .filter((task) => !(task as Record<string, unknown>).is_archive)
        .map((task) => mapTaskSummary(task as Record<string, unknown>))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    : [],
});

export const mapBoardData = (raw: Record<string, unknown>): KanbanBoardWithColumns => {
  const columns = Array.isArray(raw.kanban_columns)
    ? raw.kanban_columns
        .map((col) => mapColumn(col as Record<string, unknown>))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    : [];

  return {
    id: String(raw.id),
    name: raw.name as string,
    description: raw.description as string | undefined,
    created_at: raw.created_at as string | undefined,
    updated_at: raw.updated_at as string | undefined,
    project_id: raw.project_id as string | undefined,
    kanban_columns: columns,
    columnLoadMeta: raw.columnLoadMeta as
      | Record<string, ColumnLoadMeta>
      | undefined,
  };
};

export const filterBoardByQuery = (
  board: KanbanBoardWithColumns,
  query: string,
): KanbanBoardWithColumns => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return board;

  return {
    ...board,
    kanban_columns: board.kanban_columns.map((column) => ({
      ...column,
      tasks: (column.tasks ?? []).filter(
        (task) =>
          task.title.toLowerCase().includes(normalized) ||
          task.codev?.first_name?.toLowerCase().includes(normalized) ||
          task.codev?.last_name?.toLowerCase().includes(normalized) ||
          task.skill_category?.name?.toLowerCase().includes(normalized),
      ),
    })),
  };
};

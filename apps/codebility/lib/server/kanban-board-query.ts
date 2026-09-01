import type { SupabaseClient } from "@supabase/supabase-js";

import { KANBAN_COLUMN_TASK_PAGE_SIZE } from "@/constants/kanban/pagination";
import { mapBoardData, KanbanBoardWithColumns } from "@/lib/kanban/board-mappers";
import type { ColumnLoadMeta } from "@/lib/kanban/column-load-meta";

import { createClientServerComponent } from "@/utils/supabase/server";

import {
  fetchColumnTaskCount,
  fetchColumnTasksPage,
} from "./kanban-column-tasks-query";

export async function fetchBoardData(
  supabase: SupabaseClient,
  boardId: string,
): Promise<KanbanBoardWithColumns | null> {
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
          board_id,
          created_at,
          updated_at
        )
      `,
    )
    .eq("id", boardId)
    .single();

  if (error || !boardData) {
    console.error("Error fetching board data:", error);
    return null;
  }

  const columnLoadMeta: Record<string, ColumnLoadMeta> = {};

  if (boardData.kanban_columns?.length) {
    const columnPages = await Promise.all(
      boardData.kanban_columns.map(async (column: { id: string }) => {
        const [tasks, totalCount] = await Promise.all([
          fetchColumnTasksPage(
            supabase,
            column.id,
            0,
            KANBAN_COLUMN_TASK_PAGE_SIZE,
          ),
          fetchColumnTaskCount(supabase, column.id),
        ]);

        columnLoadMeta[column.id] = {
          loadedCount: tasks.length,
          totalCount,
        };

        return { columnId: column.id, tasks };
      }),
    );

    const tasksByColumn = new Map(
      columnPages.map((page) => [page.columnId, page.tasks]),
    );

    (boardData as { kanban_columns: Array<Record<string, unknown>> }).kanban_columns =
      boardData.kanban_columns.map((column: { id: string }) => ({
        ...column,
        tasks: tasksByColumn.get(column.id) ?? [],
      }));
  } else {
    (boardData as { kanban_columns: Array<Record<string, unknown>> }).kanban_columns =
      boardData.kanban_columns?.map((column: Record<string, unknown>) => ({
        ...column,
        tasks: [],
      })) ?? [];
  }

  return mapBoardData({
    ...(boardData as Record<string, unknown>),
    columnLoadMeta,
  });
}

export async function fetchBoardDataFromDb(
  boardId: string,
): Promise<KanbanBoardWithColumns | null> {
  const supabase = await createClientServerComponent();
  return fetchBoardData(supabase, boardId);
}

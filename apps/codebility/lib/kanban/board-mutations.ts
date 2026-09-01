import { moveTask } from "@/app/home/kanban/[projectId]/[id]/actions";
import { KanbanColumnType } from "@/types/home/codev";

import { getKanbanBoardStore } from "@/store/kanban-board/registry";

export async function commitTaskMove(
  taskId: string,
  columnId: string,
  position: number,
): Promise<{ success: boolean; error?: string }> {
  const store = getKanbanBoardStore();
  const previousColumns = store.getState().columns;

  store.getState().moveTaskLocal(taskId, columnId, position);

  const result = await moveTask({
    taskId,
    columnId,
    position,
    opId: crypto.randomUUID(),
  });

  if (!result.success) {
    store.getState().setColumns(previousColumns);
  }

  return result;
}

export function filterColumnsByMember(
  columns: KanbanColumnType[],
  activeFilter: string | null,
): KanbanColumnType[] {
  if (!activeFilter) return columns;

  return columns.map((column) => ({
    ...column,
    tasks: (column.tasks ?? []).filter(
      (task) =>
        task.codev?.id === activeFilter ||
        task.sidekick_ids?.includes(activeFilter),
    ),
  }));
}

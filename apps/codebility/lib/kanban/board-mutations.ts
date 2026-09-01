import { broadcastTaskMove } from "@/lib/kanban/board-broadcast";
import { queueOriginatorTaskMove } from "@/lib/kanban/board-snapshot-save";
import { KanbanColumnType } from "@/types/home/codev";

import { getKanbanBoardStore } from "@/store/kanban-board/registry";

export function commitTaskMove(
  taskId: string,
  columnId: string,
  position: number,
): { success: boolean } {
  const store = getKanbanBoardStore();
  const { boardId, projectId } = store.getState();

  const currentColumn = store
    .getState()
    .columns.find((column) =>
      (column.tasks ?? []).some((task) => task.id === taskId),
    );
  const currentTask = currentColumn?.tasks?.find((task) => task.id === taskId);

  if (
    currentTask &&
    currentColumn?.id === columnId &&
    (currentTask.position ?? 0) === position
  ) {
    return { success: true };
  }

  store.getState().moveTaskLocal(taskId, columnId, position);
  broadcastTaskMove(boardId, { taskId, columnId, position });
  queueOriginatorTaskMove(boardId, projectId, taskId, columnId, position);

  return { success: true };
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

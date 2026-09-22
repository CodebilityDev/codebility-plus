import type { KanbanBoardWithColumns } from "@/lib/kanban/board-mappers";

export function getBoardFingerprint(board: KanbanBoardWithColumns): string {
  return board.kanban_columns
    .map((column) => {
      const tasks = (column.tasks ?? [])
        .map((task) => `${task.id}:${task.position ?? 0}:${task.title}`)
        .join(",");
      return `${column.id}:${column.position ?? 0}:${tasks}`;
    })
    .join("|");
}

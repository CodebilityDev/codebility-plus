import { KanbanBoardWithColumns } from "@/lib/kanban/board-mappers";
import {
  adjustColumnTotalCount,
  buildColumnLoadMeta,
  type ColumnLoadMeta,
} from "@/lib/kanban/column-load-meta";
import { KanbanColumnType, Task } from "@/types/home/codev";
import { createStore, type StoreApi } from "zustand/vanilla";

export type KanbanBoardStore = {
  boardId: string;
  projectId: string;
  board: KanbanBoardWithColumns;
  columns: KanbanColumnType[];
  columnLoadMeta: Record<string, ColumnLoadMeta>;
  setColumns: (columns: KanbanColumnType[]) => void;
  moveTaskLocal: (
    taskId: string,
    columnId: string,
    position: number,
  ) => KanbanColumnType[];
  removeTaskLocal: (taskId: string) => void;
  patchTaskLocal: (taskId: string, patch: Partial<Task>) => void;
  addTaskLocal: (columnId: string, task: Task) => void;
  mergeTasksLocal: (tasks: Task[]) => void;
  appendColumnTasksLocal: (columnId: string, tasks: Task[]) => void;
  setColumnLoadMeta: (columnId: string, meta: ColumnLoadMeta) => void;
  addColumnLocal: (column: KanbanColumnType) => void;
  updateColumnLocal: (
    columnId: string,
    patch: Partial<Pick<KanbanColumnType, "name" | "position">>,
  ) => void;
  removeColumnLocal: (columnId: string) => void;
  reconcileBoard: (board: KanbanBoardWithColumns) => void;
};

function normalizePositions(columns: KanbanColumnType[]): KanbanColumnType[] {
  return columns.map((column) => ({
    ...column,
    tasks: [...(column.tasks ?? [])]
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((task, index) => ({ ...task, position: index })),
  }));
}

function applyMove(
  columns: KanbanColumnType[],
  taskId: string,
  targetColumnId: string,
  targetPosition: number,
): KanbanColumnType[] {
  let movedTask: Task | null = null;

  const withoutTask = columns.map((column) => {
    const tasks = column.tasks ?? [];
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index === -1) return column;

    movedTask = { ...tasks[index]! };
    return {
      ...column,
      tasks: tasks.filter((task) => task.id !== taskId),
    };
  });

  if (!movedTask) return columns;

  return normalizePositions(
    withoutTask.map((column) => {
      if (column.id !== targetColumnId) return column;

      const tasks = [...(column.tasks ?? [])];
      const insertAt = Math.max(0, Math.min(targetPosition, tasks.length));
      tasks.splice(insertAt, 0, {
        ...movedTask!,
        kanban_column_id: targetColumnId,
      });

      return { ...column, tasks };
    }),
  );
}

function syncColumnLoadCounts(
  columnLoadMeta: Record<string, ColumnLoadMeta>,
  columns: KanbanColumnType[],
): Record<string, ColumnLoadMeta> {
  const nextMeta = { ...columnLoadMeta };

  for (const column of columns) {
    const loadedCount = column.tasks?.length ?? 0;
    const existing = nextMeta[column.id];

    nextMeta[column.id] = existing
      ? { ...existing, loadedCount }
      : { loadedCount, totalCount: loadedCount };
  }

  return nextMeta;
}

export function createKanbanBoardStore(
  board: KanbanBoardWithColumns,
  boardId: string,
  projectId: string,
): StoreApi<KanbanBoardStore> {
  const initialColumns = normalizePositions(board.kanban_columns);
  const initialColumnLoadMeta =
    board.columnLoadMeta ?? buildColumnLoadMeta(initialColumns);

  return createStore<KanbanBoardStore>((set, get) => ({
    boardId,
    projectId,
    board: { ...board, kanban_columns: initialColumns },
    columns: initialColumns,
    columnLoadMeta: initialColumnLoadMeta,

    setColumns: (columns) => {
      const normalized = normalizePositions(columns);
      set({
        columns: normalized,
        board: { ...get().board, kanban_columns: normalized },
        columnLoadMeta: syncColumnLoadCounts(get().columnLoadMeta, normalized),
      });
    },

    moveTaskLocal: (taskId, columnId, position) => {
      const nextColumns = applyMove(get().columns, taskId, columnId, position);
      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
        columnLoadMeta: syncColumnLoadCounts(get().columnLoadMeta, nextColumns),
      });
      return nextColumns;
    },

    removeTaskLocal: (taskId) => {
      let removedFromColumnId: string | null = null;

      const nextColumns = normalizePositions(
        get().columns.map((column) => {
          const hadTask = (column.tasks ?? []).some((task) => task.id === taskId);
          if (hadTask) {
            removedFromColumnId = column.id;
          }

          return {
            ...column,
            tasks: (column.tasks ?? []).filter((task) => task.id !== taskId),
          };
        }),
      );

      let nextMeta = syncColumnLoadCounts(get().columnLoadMeta, nextColumns);
      if (removedFromColumnId) {
        nextMeta = adjustColumnTotalCount(nextMeta, removedFromColumnId, -1);
      }

      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
        columnLoadMeta: nextMeta,
      });
    },

    patchTaskLocal: (taskId, patch) => {
      const nextColumns = get().columns.map((column) => ({
        ...column,
        tasks: (column.tasks ?? []).map((task) =>
          task.id === taskId ? { ...task, ...patch } : task,
        ),
      }));
      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
      });
    },

    addTaskLocal: (columnId, task) => {
      const columns = get().columns;
      const existingColumnId = columns.reduce<string | null>((found, column) => {
        if (found) {
          return found;
        }

        return (column.tasks ?? []).some((entry) => entry.id === task.id)
          ? column.id
          : null;
      }, null);

      if (existingColumnId) {
        if (existingColumnId === columnId) {
          get().patchTaskLocal(task.id, task);
        } else {
          get().moveTaskLocal(task.id, columnId, task.position ?? 0);
        }
        return;
      }

      const nextColumns = normalizePositions(
        columns.map((column) =>
          column.id === columnId
            ? { ...column, tasks: [...(column.tasks ?? []), task] }
            : column,
        ),
      );
      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
        columnLoadMeta: adjustColumnTotalCount(
          syncColumnLoadCounts(get().columnLoadMeta, nextColumns),
          columnId,
          1,
        ),
      });
    },

    mergeTasksLocal: (tasks) => {
      if (tasks.length === 0) {
        return;
      }

      const existingIds = new Set(
        get().columns.flatMap((column) =>
          (column.tasks ?? []).map((task) => task.id),
        ),
      );
      const newTasks = tasks.filter((task) => !existingIds.has(task.id));

      if (newTasks.length === 0) {
        return;
      }

      const nextColumns = normalizePositions(
        get().columns.map((column) => {
          const tasksForColumn = newTasks.filter(
            (task) => task.kanban_column_id === column.id,
          );

          if (tasksForColumn.length === 0) {
            return column;
          }

          return {
            ...column,
            tasks: [...(column.tasks ?? []), ...tasksForColumn],
          };
        }),
      );

      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
        columnLoadMeta: syncColumnLoadCounts(get().columnLoadMeta, nextColumns),
      });
    },

    appendColumnTasksLocal: (columnId, tasks) => {
      if (tasks.length === 0) {
        return;
      }

      const column = get().columns.find((entry) => entry.id === columnId);
      if (!column) {
        return;
      }

      const existingIds = new Set((column.tasks ?? []).map((task) => task.id));
      const newTasks = tasks.filter((task) => !existingIds.has(task.id));

      if (newTasks.length === 0) {
        return;
      }

      const nextColumns = normalizePositions(
        get().columns.map((entry) =>
          entry.id === columnId
            ? { ...entry, tasks: [...(entry.tasks ?? []), ...newTasks] }
            : entry,
        ),
      );

      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
        columnLoadMeta: syncColumnLoadCounts(get().columnLoadMeta, nextColumns),
      });
    },

    setColumnLoadMeta: (columnId, meta) => {
      set({
        columnLoadMeta: {
          ...get().columnLoadMeta,
          [columnId]: meta,
        },
      });
    },

    addColumnLocal: (column) => {
      if (get().columns.some((entry) => entry.id === column.id)) {
        return;
      }

      const nextColumns = [...get().columns, { ...column, tasks: column.tasks ?? [] }]
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
        columnLoadMeta: syncColumnLoadCounts(get().columnLoadMeta, nextColumns),
      });
    },

    updateColumnLocal: (columnId, patch) => {
      const nextColumns = get()
        .columns.map((column) =>
          column.id === columnId ? { ...column, ...patch } : column,
        )
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
      });
    },

    removeColumnLocal: (columnId) => {
      const nextColumns = get().columns.filter((column) => column.id !== columnId);
      const nextMeta = { ...get().columnLoadMeta };
      delete nextMeta[columnId];

      set({
        columns: nextColumns,
        board: { ...get().board, kanban_columns: nextColumns },
        columnLoadMeta: nextMeta,
      });
    },

    reconcileBoard: (nextBoard) => {
      const normalized = normalizePositions(nextBoard.kanban_columns);
      set({
        board: { ...nextBoard, kanban_columns: normalized },
        columns: normalized,
        columnLoadMeta:
          nextBoard.columnLoadMeta ?? buildColumnLoadMeta(normalized),
      });
    },
  }));
}

export type KanbanBoardStoreApi = StoreApi<KanbanBoardStore>;

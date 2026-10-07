import { createStore } from "zustand/vanilla";
import type { StoreApi } from "zustand/vanilla";

import type {
  KanbanBoardSnapshot,
  KanbanColumn,
  KanbanState,
  KanbanTask,
} from "@/types/home/kanban/kanban";

export interface KanbanMoveBroadcast {
  taskId: string;
  toColumnId: string;
  beforeTaskId: string | null;
  afterTaskId: string | null;
}

type BoardState = Pick<
  KanbanState,
  "columnsById" | "columnOrder" | "tasksById" | "taskIdsByColumn"
>;

type MoveState = Pick<KanbanState, "tasksById" | "taskIdsByColumn">;

interface MoveOrigin {
  columnId: string;
  index: number;
}

interface KanbanActions {
  applySnapshot: (snapshot: KanbanBoardSnapshot) => void;
  upsertTask: (task: KanbanTask) => void;
  removeTask: (taskId: string) => void;
  moveTaskLocally: (
    taskId: string,
    toColumnId: string,
    targetIndex: number,
  ) => void;
  restoreMove: (taskId: string) => void;
  setActiveTask: (taskId: string | null) => void;
  setConnection: (connection: KanbanState["connection"]) => void;
  setPending: (taskId: string, pending: boolean) => void;
  broadcastMove: (move: KanbanMoveBroadcast) => void;
  setBroadcastMove: (
    broadcast: ((move: KanbanMoveBroadcast) => void) | null,
  ) => void;
}

export type KanbanStore = KanbanState & KanbanActions;
export type KanbanStoreApi = StoreApi<KanbanStore>;

function byPosition(
  first: { id: string; position: number },
  second: { id: string; position: number },
): number {
  return first.position - second.position || first.id.localeCompare(second.id);
}

function isNewer(next: string | null, previous: string | null): boolean {
  if (!next || !previous) return true;

  return Date.parse(next) > Date.parse(previous);
}

function sameIds(previous: string[], next: string[]): boolean {
  return (
    previous.length === next.length &&
    previous.every((id, index) => id === next[index])
  );
}

function sameTask(previous: KanbanTask, next: KanbanTask): boolean {
  return (
    previous.title === next.title &&
    previous.description === next.description &&
    previous.columnId === next.columnId &&
    previous.position === next.position &&
    previous.priority === next.priority &&
    previous.codevId === next.codevId &&
    previous.dueDate === next.dueDate &&
    previous.updatedAt === next.updatedAt
  );
}

function buildBoardState(
  snapshot: KanbanBoardSnapshot,
  previous?: BoardState,
): BoardState {
  const columnsById: Record<string, KanbanColumn> = {};
  const columnOrder: string[] = [];

  for (const column of [...snapshot.columns].sort(byPosition)) {
    const before = previous?.columnsById[column.id];
    columnsById[column.id] =
      before?.name === column.name && before.position === column.position
        ? before
        : column;
    columnOrder.push(column.id);
  }

  const tasksById: Record<string, KanbanTask> = {};

  for (const task of snapshot.tasks) {
    const before = previous?.tasksById[task.id];
    tasksById[task.id] = before && sameTask(before, task) ? before : task;
  }

  const taskIdsByColumn: Record<string, string[]> = {};

  for (const columnId of columnOrder) {
    const next = snapshot.tasks
      .filter((task) => task.columnId === columnId)
      .sort(byPosition)
      .map((task) => task.id);
    const before = previous?.taskIdsByColumn[columnId];

    taskIdsByColumn[columnId] = before && sameIds(before, next) ? before : next;
  }

  return { columnsById, columnOrder, tasksById, taskIdsByColumn };
}

function withTaskInserted(
  ids: string[],
  tasksById: Record<string, KanbanTask>,
  task: KanbanTask,
): string[] {
  const rest = ids.filter((id) => id !== task.id);
  const index = rest.findIndex(
    (id) => (tasksById[id]?.position ?? 0) > task.position,
  );

  return index < 0
    ? [...rest, task.id]
    : [...rest.slice(0, index), task.id, ...rest.slice(index)];
}

function moveLocally(
  state: MoveState,
  taskId: string,
  toColumnId: string,
  targetIndex: number,
): MoveState | null {
  const task = state.tasksById[taskId];

  if (!task) return null;

  const fromColumnId = task.columnId;
  const source = state.taskIdsByColumn[fromColumnId] ?? [];

  if (fromColumnId === toColumnId && source.indexOf(taskId) === targetIndex) {
    return null;
  }

  const rest = source.filter((id) => id !== taskId);
  const destination =
    fromColumnId === toColumnId
      ? rest
      : (state.taskIdsByColumn[toColumnId] ?? []).filter((id) => id !== taskId);
  const index = Math.min(Math.max(targetIndex, 0), destination.length);
  const taskIdsByColumn = { ...state.taskIdsByColumn };

  taskIdsByColumn[toColumnId] = [
    ...destination.slice(0, index),
    taskId,
    ...destination.slice(index),
  ];

  if (fromColumnId !== toColumnId) {
    taskIdsByColumn[fromColumnId] = rest;
  }

  return {
    tasksById: {
      ...state.tasksById,
      [taskId]: { ...task, columnId: toColumnId },
    },
    taskIdsByColumn,
  };
}

export function createKanbanStore(
  snapshot: KanbanBoardSnapshot | null,
): KanbanStoreApi {
  const initial: BoardState = snapshot
    ? buildBoardState(snapshot)
    : { columnsById: {}, columnOrder: [], tasksById: {}, taskIdsByColumn: {} };
  const origins = new Map<string, MoveOrigin>();
  let broadcast: ((move: KanbanMoveBroadcast) => void) | null = null;

  return createStore<KanbanStore>()((set) => ({
    ...initial,
    activeTaskId: null,
    pending: {},
    connection: "connecting",

    applySnapshot: (next) =>
      set((state) => {
        origins.clear();

        return buildBoardState(next, state);
      }),

    upsertTask: (task) =>
      set((state) => {
        if (state.pending[task.id]) return state;

        const previous = state.tasksById[task.id];

        if (previous && !isNewer(task.updatedAt, previous.updatedAt)) {
          return state;
        }

        origins.delete(task.id);

        const tasksById = { ...state.tasksById, [task.id]: task };

        if (!previous) {
          return {
            tasksById,
            taskIdsByColumn: {
              ...state.taskIdsByColumn,
              [task.columnId]: withTaskInserted(
                state.taskIdsByColumn[task.columnId] ?? [],
                tasksById,
                task,
              ),
            },
          };
        }

        if (state.connection === "live") {
          return sameTask(previous, task) ? state : { tasksById };
        }

        if (previous.columnId === task.columnId) {
          if (previous.position === task.position) {
            return { tasksById };
          }

          return {
            tasksById,
            taskIdsByColumn: {
              ...state.taskIdsByColumn,
              [task.columnId]: withTaskInserted(
                state.taskIdsByColumn[task.columnId] ?? [],
                tasksById,
                task,
              ),
            },
          };
        }

        return {
          tasksById,
          taskIdsByColumn: {
            ...state.taskIdsByColumn,
            [previous.columnId]: (
              state.taskIdsByColumn[previous.columnId] ?? []
            ).filter((id) => id !== task.id),
            [task.columnId]: withTaskInserted(
              state.taskIdsByColumn[task.columnId] ?? [],
              tasksById,
              task,
            ),
          },
        };
      }),

    removeTask: (taskId) =>
      set((state) => {
        const task = state.tasksById[taskId];

        if (!task) return state;

        origins.delete(taskId);

        const tasksById = { ...state.tasksById };
        delete tasksById[taskId];

        const pending = { ...state.pending };
        delete pending[taskId];

        return {
          tasksById,
          pending,
          taskIdsByColumn: {
            ...state.taskIdsByColumn,
            [task.columnId]: (
              state.taskIdsByColumn[task.columnId] ?? []
            ).filter((id) => id !== taskId),
          },
          activeTaskId:
            state.activeTaskId === taskId ? null : state.activeTaskId,
        };
      }),

    moveTaskLocally: (taskId, toColumnId, targetIndex) =>
      set((state) => {
        const task = state.tasksById[taskId];

        if (!task) return state;

        if (!origins.has(taskId)) {
          origins.set(taskId, {
            columnId: task.columnId,
            index: (state.taskIdsByColumn[task.columnId] ?? []).indexOf(taskId),
          });
        }

        return moveLocally(state, taskId, toColumnId, targetIndex) ?? state;
      }),

    restoreMove: (taskId) =>
      set((state) => {
        const origin = origins.get(taskId);

        origins.delete(taskId);

        if (!origin) return state;

        return (
          moveLocally(state, taskId, origin.columnId, origin.index) ?? state
        );
      }),

    setActiveTask: (taskId) => set({ activeTaskId: taskId }),

    setConnection: (connection) =>
      set((state) =>
        state.connection === connection ? state : { connection },
      ),

    setPending: (taskId, pending) =>
      set((state) => {
        if (pending) {
          return { pending: { ...state.pending, [taskId]: true } };
        }

        if (!state.pending[taskId]) return state;

        const next = { ...state.pending };
        delete next[taskId];

        return { pending: next };
      }),

    broadcastMove: (move) => broadcast?.(move),

    setBroadcastMove: (next) => {
      broadcast = next;
    },
  }));
}

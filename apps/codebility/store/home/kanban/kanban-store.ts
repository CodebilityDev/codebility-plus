import { createStore } from "zustand/vanilla";
import type { StoreApi } from "zustand/vanilla";

import type {
  KanbanBoardSnapshot,
  KanbanColumn,
  KanbanState,
  KanbanTask,
} from "@/types/home/kanban/kanban";
import { assignPositions, resolvePosition } from "@/utils/home/kanban/position";

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
  position: number;
}

interface KanbanActions {
  applySnapshot: (snapshot: KanbanBoardSnapshot) => void;
  upsertColumn: (column: KanbanColumn) => void;
  removeColumn: (columnId: string) => void;
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
  setSyncing: (syncing: boolean) => void;
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

function tasksInColumn(
  tasksById: Record<string, KanbanTask>,
  columnId: string,
): KanbanTask[] {
  return Object.values(tasksById)
    .filter((task) => task.columnId === columnId)
    .sort(byPosition);
}

function deriveTaskIdsByColumn(
  tasksById: Record<string, KanbanTask>,
  previous?: Record<string, string[]>,
): Record<string, string[]> {
  const columnIds = [
    ...new Set(Object.values(tasksById).map((task) => task.columnId)),
  ];
  const derived: Record<string, string[]> = {};
  let same =
    previous !== undefined && Object.keys(previous).length === columnIds.length;

  for (const columnId of columnIds) {
    const ids = tasksInColumn(tasksById, columnId).map((task) => task.id);
    const before = previous?.[columnId];

    derived[columnId] = before && sameIds(before, ids) ? before : ids;
    same = same && derived[columnId] === before;
  }

  return same && previous ? previous : derived;
}

function buildBoardState(
  snapshot: KanbanBoardSnapshot,
  previous?: BoardState,
): BoardState {
  const columnsById: Record<string, KanbanColumn> = {};
  const columnOrder: string[] = [];
  let sameColumns =
    previous !== undefined &&
    Object.keys(previous.columnsById).length === snapshot.columns.length;

  for (const column of [...snapshot.columns].sort(byPosition)) {
    const before = previous?.columnsById[column.id];
    columnsById[column.id] =
      before?.name === column.name && before.position === column.position
        ? before
        : column;
    columnOrder.push(column.id);
    sameColumns = sameColumns && columnsById[column.id] === before;
  }

  const tasksById: Record<string, KanbanTask> = {};

  for (const task of snapshot.tasks) {
    const before = previous?.tasksById[task.id];
    tasksById[task.id] = before && sameTask(before, task) ? before : task;
  }

  return {
    columnsById: sameColumns && previous ? previous.columnsById : columnsById,
    columnOrder:
      previous && sameIds(previous.columnOrder, columnOrder)
        ? previous.columnOrder
        : columnOrder,
    tasksById,
    taskIdsByColumn: deriveTaskIdsByColumn(
      tasksById,
      previous?.taskIdsByColumn,
    ),
  };
}

function moveLocally(
  state: MoveState,
  taskId: string,
  toColumnId: string,
  targetIndex: number,
): MoveState | null {
  const task = state.tasksById[taskId];

  if (!task) return null;

  const column = tasksInColumn(state.tasksById, toColumnId);
  const destination = column.filter((entry) => entry.id !== taskId);
  const index = Math.min(Math.max(targetIndex, 0), destination.length);

  if (task.columnId === toColumnId && column.indexOf(task) === index) {
    return null;
  }

  const plan = resolvePosition(
    destination[index - 1]?.position ?? null,
    destination[index]?.position ?? null,
  );

  const tasksById = { ...state.tasksById };

  if (plan.renumber) {
    const orderedIds = destination.map((entry) => entry.id);

    orderedIds.splice(index, 0, taskId);

    for (const row of assignPositions(orderedIds)) {
      const entry = tasksById[row.id];

      if (!entry) continue;

      tasksById[row.id] = {
        ...entry,
        columnId: toColumnId,
        position: row.position,
      };
    }
  } else {
    tasksById[taskId] = {
      ...task,
      columnId: toColumnId,
      position: plan.position,
    };
  }

  return {
    tasksById,
    taskIdsByColumn: deriveTaskIdsByColumn(tasksById, state.taskIdsByColumn),
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
    syncing: false,

    applySnapshot: (next) =>
      set((state) => {
        origins.clear();

        return buildBoardState(next, state);
      }),

    upsertColumn: (column) =>
      set((state) => {
        const previous = state.columnsById[column.id];

        if (
          previous?.name === column.name &&
          previous.position === column.position
        ) {
          return state;
        }

        const columnsById = { ...state.columnsById, [column.id]: column };

        return {
          columnsById,
          columnOrder: Object.values(columnsById)
            .sort(byPosition)
            .map((entry) => entry.id),
        };
      }),

    removeColumn: (columnId) =>
      set((state) => {
        if (!state.columnsById[columnId]) return state;

        const columnsById = { ...state.columnsById };
        delete columnsById[columnId];

        return {
          columnsById,
          columnOrder: state.columnOrder.filter((id) => id !== columnId),
        };
      }),

    upsertTask: (task) =>
      set((state) => {
        if (state.pending[task.id]) return state;

        const previous = state.tasksById[task.id];

        if (previous && !isNewer(task.updatedAt, previous.updatedAt)) {
          return state;
        }

        if (previous && sameTask(previous, task)) return state;

        origins.delete(task.id);

        const tasksById = { ...state.tasksById, [task.id]: task };

        return {
          tasksById,
          taskIdsByColumn: deriveTaskIdsByColumn(
            tasksById,
            state.taskIdsByColumn,
          ),
        };
      }),

    removeTask: (taskId) =>
      set((state) => {
        if (!state.tasksById[taskId]) return state;

        origins.delete(taskId);

        const tasksById = { ...state.tasksById };
        delete tasksById[taskId];

        const pending = { ...state.pending };
        delete pending[taskId];

        return {
          tasksById,
          pending,
          taskIdsByColumn: deriveTaskIdsByColumn(
            tasksById,
            state.taskIdsByColumn,
          ),
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
            position: task.position,
          });
        }

        return moveLocally(state, taskId, toColumnId, targetIndex) ?? state;
      }),

    restoreMove: (taskId) =>
      set((state) => {
        const origin = origins.get(taskId);

        origins.delete(taskId);

        if (!origin) return state;

        const task = state.tasksById[taskId];

        if (!task) return state;

        if (
          task.columnId === origin.columnId &&
          task.position === origin.position
        ) {
          return state;
        }

        const tasksById = {
          ...state.tasksById,
          [taskId]: {
            ...task,
            columnId: origin.columnId,
            position: origin.position,
          },
        };

        return {
          tasksById,
          taskIdsByColumn: deriveTaskIdsByColumn(
            tasksById,
            state.taskIdsByColumn,
          ),
        };
      }),

    setActiveTask: (taskId) => set({ activeTaskId: taskId }),

    setConnection: (connection) =>
      set((state) =>
        state.connection === connection ? state : { connection },
      ),

    setSyncing: (syncing) =>
      set((state) => (state.syncing === syncing ? state : { syncing })),

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

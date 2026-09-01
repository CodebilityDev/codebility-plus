import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { mapTaskSummary } from "@/lib/kanban/board-mappers";
import {
  shouldIgnoreRemoteColumnPatches,
  shouldSuppressPostgresForTask,
} from "@/lib/kanban/own-writes";
import type { KanbanBoardStoreApi } from "@/store/kanban-board/create-kanban-board-store";
import { Task } from "@/types/home/codev";

type TaskRow = Record<string, unknown>;
type ColumnRow = Record<string, unknown>;

const POSTGRES_FLUSH_MS = 250;

type TaskQueueState = {
  store: KanbanBoardStoreApi;
  getColumnIds: () => Set<string>;
  pending: Map<string, RealtimePostgresChangesPayload<TaskRow>>;
  timer: ReturnType<typeof setTimeout> | null;
};

type ColumnQueueState = {
  store: KanbanBoardStoreApi;
  pending: Map<string, RealtimePostgresChangesPayload<ColumnRow>>;
  timer: ReturnType<typeof setTimeout> | null;
};

const taskQueues = new Map<string, TaskQueueState>();
const columnQueues = new Map<string, ColumnQueueState>();

function mapRealtimeTask(row: TaskRow): Task {
  return mapTaskSummary(row);
}

function findTaskColumnId(
  columns: { id: string; tasks?: Task[] }[],
  taskId: string,
): string | null {
  for (const column of columns) {
    if ((column.tasks ?? []).some((task) => task.id === taskId)) {
      return column.id;
    }
  }
  return null;
}

function findTask(
  columns: { id: string; tasks?: Task[] }[],
  taskId: string,
): Task | null {
  for (const column of columns) {
    const task = (column.tasks ?? []).find((entry) => entry.id === taskId);
    if (task) {
      return task;
    }
  }
  return null;
}

function taskSummaryMatches(current: Task, remote: Task): boolean {
  return (
    current.kanban_column_id === remote.kanban_column_id &&
    (current.position ?? 0) === (remote.position ?? 0) &&
    current.title === remote.title &&
    current.priority === remote.priority &&
    current.difficulty === remote.difficulty &&
    current.type === remote.type &&
    current.deadline === remote.deadline &&
    current.points === remote.points &&
    current.codev_id === remote.codev_id &&
    JSON.stringify(current.sidekick_ids ?? []) ===
      JSON.stringify(remote.sidekick_ids ?? [])
  );
}

function getTaskIdFromPayload(
  payload: RealtimePostgresChangesPayload<TaskRow>,
): string | null {
  if (payload.eventType === "DELETE") {
    return payload.old?.id ? String(payload.old.id) : null;
  }

  return payload.new?.id ? String(payload.new.id) : null;
}

function applyRemoteTaskChange(
  store: KanbanBoardStoreApi,
  payload: RealtimePostgresChangesPayload<TaskRow>,
  columnIds: Set<string>,
) {
  const eventType = payload.eventType;
  const state = store.getState();

  if (eventType === "DELETE") {
    const oldRow = payload.old;
    const taskId = oldRow.id ? String(oldRow.id) : null;
    const columnId = oldRow.kanban_column_id
      ? String(oldRow.kanban_column_id)
      : null;

    if (!taskId || shouldSuppressPostgresForTask(taskId)) {
      return;
    }

    if (columnId && columnIds.has(columnId) && findTask(state.columns, taskId)) {
      state.removeTaskLocal(taskId);
    }
    return;
  }

  const row = payload.new;
  if (!row?.id) {
    return;
  }

  const task = mapRealtimeTask(row);
  const taskId = task.id;

  if (shouldSuppressPostgresForTask(taskId)) {
    return;
  }

  if (task.is_archive) {
    if (findTask(state.columns, taskId)) {
      state.removeTaskLocal(taskId);
    }
    return;
  }

  const taskColumnId = task.kanban_column_id
    ? String(task.kanban_column_id)
    : null;
  const existingTask = findTask(state.columns, taskId);
  const previousColumnId = existingTask
    ? findTaskColumnId(state.columns, taskId)
    : null;
  const isOnBoard = taskColumnId !== null && columnIds.has(taskColumnId);
  const wasOnBoard = previousColumnId !== null;

  if (!isOnBoard) {
    if (wasOnBoard) {
      state.removeTaskLocal(taskId);
    }
    return;
  }

  if (existingTask && taskSummaryMatches(existingTask, task)) {
    return;
  }

  if (!wasOnBoard) {
    state.addTaskLocal(taskColumnId!, task);
    return;
  }

  if (!existingTask) {
    return;
  }

  const positionChanged =
    (existingTask.position ?? 0) !== (task.position ?? 0);
  const columnChanged = existingTask.kanban_column_id !== taskColumnId;

  if (columnChanged || positionChanged) {
    state.moveTaskLocal(taskId, taskColumnId!, task.position ?? 0);
    return;
  }

  state.patchTaskLocal(taskId, {
    title: task.title,
    priority: task.priority,
    difficulty: task.difficulty,
    type: task.type,
    deadline: task.deadline,
    points: task.points,
    codev_id: task.codev_id,
    sidekick_ids: task.sidekick_ids,
  });
}

function flushTaskQueue(boardId: string) {
  const queue = taskQueues.get(boardId);
  if (!queue) {
    return;
  }

  queue.timer = null;
  const payloads = [...queue.pending.values()];
  queue.pending.clear();

  const columnIds = queue.getColumnIds();
  for (const payload of payloads) {
    applyRemoteTaskChange(queue.store, payload, columnIds);
  }
}

function flushColumnQueue(boardId: string) {
  const queue = columnQueues.get(boardId);
  if (!queue) {
    return;
  }

  queue.timer = null;
  const payloads = [...queue.pending.values()];
  queue.pending.clear();

  for (const payload of payloads) {
    applyRemoteColumnChange(queue.store, payload);
  }
}

function applyRemoteColumnChange(
  store: KanbanBoardStoreApi,
  payload: RealtimePostgresChangesPayload<ColumnRow>,
) {
  if (shouldIgnoreRemoteColumnPatches()) {
    return;
  }

  const state = store.getState();
  const eventType = payload.eventType;

  if (eventType === "DELETE") {
    const columnId = payload.old.id ? String(payload.old.id) : null;
    if (columnId) {
      state.removeColumnLocal(columnId);
    }
    return;
  }

  const row = payload.new;
  if (!row?.id) {
    return;
  }

  const columnId = String(row.id);
  const exists = state.columns.some((column) => column.id === columnId);
  const currentColumn = state.columns.find((column) => column.id === columnId);

  if (eventType === "INSERT" && !exists) {
    state.addColumnLocal({
      id: columnId,
      board_id: row.board_id as string | undefined,
      name: String(row.name ?? ""),
      position: (row.position as number | undefined) ?? 0,
      created_at: row.created_at as string | undefined,
      updated_at: row.updated_at as string | undefined,
      tasks: [],
    });
    return;
  }

  if (exists && currentColumn) {
    const nextName = row.name as string | undefined;
    const nextPosition = row.position as number | undefined;

    if (
      (nextName === undefined || currentColumn.name === nextName) &&
      (nextPosition === undefined ||
        (currentColumn.position ?? 0) === nextPosition)
    ) {
      return;
    }

    state.updateColumnLocal(columnId, {
      name: nextName,
      position: nextPosition,
    });
  }
}

export function bindPostgresSyncQueue(
  boardId: string,
  store: KanbanBoardStoreApi,
  getColumnIds: () => Set<string>,
) {
  taskQueues.set(boardId, {
    store,
    getColumnIds,
    pending: new Map(),
    timer: null,
  });
  columnQueues.set(boardId, {
    store,
    pending: new Map(),
    timer: null,
  });
}

export function unbindPostgresSyncQueue(boardId: string) {
  const taskQueue = taskQueues.get(boardId);
  if (taskQueue?.timer) {
    clearTimeout(taskQueue.timer);
  }
  taskQueues.delete(boardId);

  const columnQueue = columnQueues.get(boardId);
  if (columnQueue?.timer) {
    clearTimeout(columnQueue.timer);
  }
  columnQueues.delete(boardId);
}

export function enqueuePostgresTaskChange(
  boardId: string,
  payload: RealtimePostgresChangesPayload<TaskRow>,
) {
  const taskId = getTaskIdFromPayload(payload);
  if (!taskId) {
    return;
  }

  if (
    payload.eventType !== "DELETE" &&
    shouldSuppressPostgresForTask(taskId)
  ) {
    return;
  }

  const queue = taskQueues.get(boardId);
  if (!queue) {
    return;
  }

  queue.pending.set(taskId, payload);

  if (!queue.timer) {
    queue.timer = setTimeout(() => flushTaskQueue(boardId), POSTGRES_FLUSH_MS);
  }
}

export function enqueuePostgresColumnChange(
  boardId: string,
  payload: RealtimePostgresChangesPayload<ColumnRow>,
) {
  const columnId =
    payload.eventType === "DELETE"
      ? payload.old?.id
        ? String(payload.old.id)
        : null
      : payload.new?.id
        ? String(payload.new.id)
        : null;

  if (!columnId) {
    return;
  }

  const queue = columnQueues.get(boardId);
  if (!queue) {
    return;
  }

  queue.pending.set(columnId, payload);

  if (!queue.timer) {
    queue.timer = setTimeout(() => flushColumnQueue(boardId), POSTGRES_FLUSH_MS);
  }
}

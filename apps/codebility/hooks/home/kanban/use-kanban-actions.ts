"use client";

import { useEffect } from "react";
import { z } from "zod";

import {
  createTask,
  deleteTask,
  syncTaskMoves,
  updateTask,
} from "@/actions/home/kanban/tasks";
import { resolveIndex } from "@/utils/home/kanban/position";
import type { KanbanStoreApi } from "@/store/home/kanban/kanban-store";

const MOVE_DEBOUNCE_MS = 500;
const OUTBOX_KEY = "kanban-outbox";

interface MoveInput {
  taskId: string;
  toColumnId: string;
  targetIndex: number;
  beforeTaskId: string | null;
  afterTaskId: string | null;
}

const outbox = z.array(
  z.object({
    taskId: z.string().min(1),
    toColumnId: z.string().min(1),
    beforeTaskId: z.string().min(1).nullable(),
    afterTaskId: z.string().min(1).nullable(),
  }),
);

function readOutbox() {
  try {
    const raw = sessionStorage.getItem(OUTBOX_KEY);

    sessionStorage.removeItem(OUTBOX_KEY);

    const parsed = outbox.safeParse(raw === null ? [] : JSON.parse(raw));

    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

async function withPending(
  store: KanbanStoreApi,
  taskId: string,
  action: () => Promise<void>,
) {
  store.getState().setPending(taskId, true);

  try {
    await action();
  } finally {
    store.getState().setPending(taskId, false);
  }
}

function createMoveQueue(store: KanbanStoreApi) {
  const waiting = new Map<string, MoveInput>();
  const awaitingAck = new Map<string, MoveInput>();
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inFlight = false;
  let sendOwed = false;
  let restored = false;

  const persist = () => {
    const durable = new Map(awaitingAck);

    for (const [taskId, entry] of waiting) durable.set(taskId, entry);

    if (durable.size === 0) {
      sessionStorage.removeItem(OUTBOX_KEY);
      return;
    }

    sessionStorage.setItem(
      OUTBOX_KEY,
      JSON.stringify(
        [...durable.values()].map(
          ({ taskId, toColumnId, beforeTaskId, afterTaskId }) => ({
            taskId,
            toColumnId,
            beforeTaskId,
            afterTaskId,
          }),
        ),
      ),
    );
  };

  const send = async () => {
    if (waiting.size === 0) return;

    const batch = [...waiting.values()];
    waiting.clear();

    for (const entry of batch) awaitingAck.set(entry.taskId, entry);

    persist();
    inFlight = true;
    store.getState().setSyncing(true);

    let release = false;

    try {
      await syncTaskMoves({
        moves: batch.map(
          ({ taskId, toColumnId, beforeTaskId, afterTaskId }) => ({
            taskId,
            toColumnId,
            beforeTaskId,
            afterTaskId,
          }),
        ),
      });

      release = true;
    } catch (error) {
      for (const { taskId } of batch) store.getState().restoreMove(taskId);

      console.error(error);
    }

    if (release) for (const { taskId } of batch) awaitingAck.delete(taskId);

    inFlight = false;

    for (const { taskId } of batch) {
      if (!waiting.has(taskId)) store.getState().setPending(taskId, false);
    }

    if (sendOwed) {
      sendOwed = false;
      await send();
    }

    store.getState().setSyncing(false);
    persist();
  };

  const onTimer = () => {
    timer = null;

    if (inFlight) {
      sendOwed = true;
      return;
    }

    void send();
  };

  const move = (input: MoveInput) => {
    const { taskId } = input;

    store
      .getState()
      .moveTaskLocally(taskId, input.toColumnId, input.targetIndex);
    store.getState().setPending(taskId, true);
    store.getState().broadcastMove({
      taskId,
      toColumnId: input.toColumnId,
      beforeTaskId: input.beforeTaskId,
      afterTaskId: input.afterTaskId,
    });

    waiting.set(taskId, input);
    persist();

    if (timer !== null) clearTimeout(timer);

    timer = setTimeout(onTimer, MOVE_DEBOUNCE_MS);
  };

  const flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }

    onTimer();
  };

  const restore = () => {
    if (restored) return;

    restored = true;

    for (const entry of readOutbox()) {
      const state = store.getState();

      if (!state.tasksById[entry.taskId]) continue;

      const rest = (state.taskIdsByColumn[entry.toColumnId] ?? []).filter(
        (id) => id !== entry.taskId,
      );
      const index = resolveIndex(rest, entry.beforeTaskId, entry.afterTaskId);

      state.moveTaskLocally(entry.taskId, entry.toColumnId, index);
      state.setPending(entry.taskId, true);
      waiting.set(entry.taskId, { ...entry, targetIndex: index });
    }

    if (waiting.size === 0) return;

    persist();
    flush();
  };

  return { move, flush, restore };
}

type MoveQueue = ReturnType<typeof createMoveQueue>;

const queues = new WeakMap<KanbanStoreApi, MoveQueue>();

function getMoveQueue(store: KanbanStoreApi) {
  const existing = queues.get(store);

  if (existing) return existing;

  const queue = createMoveQueue(store);

  queues.set(store, queue);

  return queue;
}

export function useKanbanActions(store: KanbanStoreApi) {
  const queue = getMoveQueue(store);

  useEffect(() => {
    queue.restore();

    const flushWhenHidden = () => {
      if (document.visibilityState === "hidden") queue.flush();
    };

    document.addEventListener("visibilitychange", flushWhenHidden);
    window.addEventListener("pagehide", queue.flush);

    return () => {
      document.removeEventListener("visibilitychange", flushWhenHidden);
      window.removeEventListener("pagehide", queue.flush);
    };
  }, [queue]);

  const create = async (input: {
    columnId: string;
    title: string;
    description?: string;
    priority?: string;
  }) => {
    await createTask(input);
  };

  const update = async (input: {
    taskId: string;
    title?: string;
    description?: string;
    priority?: string;
  }) => {
    await withPending(store, input.taskId, () => updateTask(input));
  };

  const remove = async (taskId: string) => {
    await withPending(store, taskId, () => deleteTask(taskId));
  };

  return {
    moveTask: queue.move,
    createTask: create,
    updateTask: update,
    deleteTask: remove,
  };
}

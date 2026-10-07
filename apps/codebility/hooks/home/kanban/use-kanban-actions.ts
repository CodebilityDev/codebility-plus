"use client";

import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  moveTask,
  updateTask,
} from "@/actions/home/kanban/tasks";
import type { KanbanStoreApi } from "@/store/home/kanban/kanban-store";

const MOVE_DEBOUNCE_MS = 300;

interface MoveInput {
  taskId: string;
  toColumnId: string;
  targetIndex: number;
  beforeTaskId: string | null;
  afterTaskId: string | null;
}

interface MoveEntry {
  queued: MoveInput | null;
  timer: ReturnType<typeof setTimeout> | null;
  inFlight: boolean;
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
  const entries = new Map<string, MoveEntry>();

  const send = async (taskId: string, entry: MoveEntry, input: MoveInput) => {
    entry.inFlight = true;

    try {
      await moveTask({
        taskId,
        toColumnId: input.toColumnId,
        beforeTaskId: input.beforeTaskId,
        afterTaskId: input.afterTaskId,
      });
    } catch (error) {
      entry.inFlight = false;
      entry.queued = null;

      if (entry.timer !== null) {
        clearTimeout(entry.timer);
        entry.timer = null;
      }

      entries.delete(taskId);
      store.getState().restoreMove(taskId);
      store.getState().setPending(taskId, false);
      console.error(error);

      return;
    }

    entry.inFlight = false;

    const next = entry.queued;

    if (next) {
      entry.queued = null;
      await send(taskId, entry, next);
      return;
    }

    if (entry.timer !== null) {
      clearTimeout(entry.timer);
      entry.timer = null;
    }

    entries.delete(taskId);
    store.getState().setPending(taskId, false);
  };

  const flush = (taskId: string, entry: MoveEntry) => {
    if (entry.timer !== null) {
      clearTimeout(entry.timer);
      entry.timer = null;
    }

    const input = entry.queued;

    if (entry.inFlight || !input) return;

    entry.queued = null;
    void send(taskId, entry, input);
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

    const entry: MoveEntry = entries.get(taskId) ?? {
      queued: null,
      timer: null,
      inFlight: false,
    };

    entries.set(taskId, entry);

    if (entry.timer !== null) clearTimeout(entry.timer);

    entry.queued = input;
    entry.timer = setTimeout(() => {
      entry.timer = null;
      flush(taskId, entry);
    }, MOVE_DEBOUNCE_MS);
  };

  const flushAll = () => {
    for (const [taskId, entry] of entries) flush(taskId, entry);
  };

  return { move, flushAll };
}

export function useKanbanActions(store: KanbanStoreApi) {
  const [queue] = useState(() => createMoveQueue(store));

  useEffect(() => {
    const flushWhenHidden = () => {
      if (document.visibilityState === "hidden") queue.flushAll();
    };

    document.addEventListener("visibilitychange", flushWhenHidden);
    window.addEventListener("pagehide", queue.flushAll);

    return () => {
      document.removeEventListener("visibilitychange", flushWhenHidden);
      window.removeEventListener("pagehide", queue.flushAll);
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

"use client";

import { useEffect, useState } from "react";

import {
  createTask,
  deleteTask,
  syncTaskMoves,
  updateTask,
} from "@/actions/home/kanban/tasks";
import type { KanbanStoreApi } from "@/store/home/kanban/kanban-store";

const MOVE_DEBOUNCE_MS = 500;

interface MoveInput {
  taskId: string;
  toColumnId: string;
  targetIndex: number;
  beforeTaskId: string | null;
  afterTaskId: string | null;
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
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inFlight = false;
  let sendOwed = false;

  const send = async () => {
    if (waiting.size === 0) return;

    const batch = [...waiting.values()];
    waiting.clear();
    inFlight = true;

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
    } catch (error) {
      for (const { taskId } of batch) {
        store.getState().restoreMove(taskId);
      }

      console.error(error);
    }

    inFlight = false;

    for (const { taskId } of batch) {
      if (!waiting.has(taskId)) store.getState().setPending(taskId, false);
    }

    if (sendOwed) {
      sendOwed = false;
      await send();
    }
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

  return { move, flush };
}

export function useKanbanActions(store: KanbanStoreApi) {
  const [queue] = useState(() => createMoveQueue(store));

  useEffect(() => {
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

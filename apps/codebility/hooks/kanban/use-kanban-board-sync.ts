"use client";

import {
  broadcastTaskPatch,
  broadcastTaskRemove,
} from "@/lib/kanban/board-broadcast";
import { clearTaskDetailCache } from "@/lib/kanban/task-detail-cache";
import { Task } from "@/types/home/codev";
import { tryGetKanbanBoardStore } from "@/store/kanban-board/registry";

/**
 * Board layout is client-authoritative during the session.
 * DB snapshot sync is silent; server data loads on full page reload only.
 */
export function useKanbanBoardSync() {
  const refreshBoard = () => {
    clearTaskDetailCache();
  };

  const removeTask = (taskId: string) => {
    const store = tryGetKanbanBoardStore();
    if (!store) {
      return;
    }

    store.getState().removeTaskLocal(taskId);
    broadcastTaskRemove(store.getState().boardId, taskId);
  };

  const patchTask = (taskId: string, patch: Partial<Task>) => {
    const store = tryGetKanbanBoardStore();
    if (!store) {
      return;
    }

    store.getState().patchTaskLocal(taskId, patch);
    broadcastTaskPatch(store.getState().boardId, { taskId, patch });
  };

  return { refreshBoard, removeTask, patchTask };
}

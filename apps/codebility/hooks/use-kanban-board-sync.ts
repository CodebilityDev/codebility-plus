"use client";

import { useRouter } from "next/navigation";

import {
  broadcastTaskPatch,
  broadcastTaskRemove,
} from "@/lib/kanban/board-broadcast";
import { clearTaskDetailCache } from "@/lib/kanban/task-detail-cache";
import { registerOwnTaskWrite } from "@/lib/kanban/own-writes";
import { Task } from "@/types/home/codev";
import { tryGetKanbanBoardStore } from "@/store/kanban-board/registry";

export function useKanbanBoardSync() {
  const router = useRouter();

  const refreshBoard = () => {
    clearTaskDetailCache();
    router.refresh();
  };

  const removeTask = (taskId: string) => {
    const store = tryGetKanbanBoardStore();
    if (!store) {
      return;
    }

    registerOwnTaskWrite(taskId);
    store.getState().removeTaskLocal(taskId);
    broadcastTaskRemove(store.getState().boardId, taskId);
  };

  const patchTask = (taskId: string, patch: Partial<Task>) => {
    const store = tryGetKanbanBoardStore();
    if (!store) {
      return;
    }

    registerOwnTaskWrite(taskId);
    store.getState().patchTaskLocal(taskId, patch);
    broadcastTaskPatch(store.getState().boardId, { taskId, patch });
  };

  return { refreshBoard, removeTask, patchTask };
}

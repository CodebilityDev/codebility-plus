"use client";

import { useRouter } from "next/navigation";

import { clearTaskDetailCache } from "@/lib/kanban/task-detail-cache";
import { Task } from "@/types/home/codev";
import { tryGetKanbanBoardStore } from "@/store/kanban-board/registry";

export function useKanbanBoardSync() {
  const router = useRouter();

  const refreshBoard = () => {
    clearTaskDetailCache();
    router.refresh();
  };

  const removeTask = (taskId: string) => {
    tryGetKanbanBoardStore()?.getState().removeTaskLocal(taskId);
  };

  const patchTask = (taskId: string, patch: Partial<Task>) => {
    tryGetKanbanBoardStore()?.getState().patchTaskLocal(taskId, patch);
  };

  return { refreshBoard, removeTask, patchTask };
}

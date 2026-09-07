import type { KanbanTaskDetail } from "@/lib/server/kanban-task-query";

const taskDetailCache = new Map<string, KanbanTaskDetail>();

export function getCachedTaskDetail(
  taskId: string,
): KanbanTaskDetail | undefined {
  return taskDetailCache.get(taskId);
}

export function setCachedTaskDetail(
  taskId: string,
  detail: KanbanTaskDetail,
): void {
  taskDetailCache.set(taskId, detail);
}

export function invalidateTaskDetail(taskId: string): void {
  taskDetailCache.delete(taskId);
}

export function clearTaskDetailCache(): void {
  taskDetailCache.clear();
}

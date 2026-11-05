"use client";

import { useKanbanRealtime } from "@/hooks/home/kanban/use-kanban-realtime";
import { useKanbanStoreApi } from "@/providers/home/kanban/KanbanStoreProvider";

export default function KanbanRealtimeBridge({
  boardId,
  sprintId,
}: {
  boardId: string;
  sprintId: string;
}) {
  const store = useKanbanStoreApi();

  useKanbanRealtime({ store, boardId, sprintId });

  return null;
}

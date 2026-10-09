"use client";

import { useRef } from "react";
import {
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Over,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import KanbanColumn from "@/components/home/kanban/KanbanColumn";
import KanbanDragOverlay from "@/components/home/kanban/KanbanDragOverlay";
import { useKanbanActions } from "@/hooks/home/kanban/use-kanban-actions";
import {
  useKanbanStore,
  useKanbanStoreApi,
} from "@/providers/home/kanban/KanbanStoreProvider";

function resolveTarget(over: Over | null) {
  const data = over?.data.current;
  if (!data) {
    return null;
  }
  const columnId: unknown = data.columnId;
  const index: unknown = data.index;
  if (typeof columnId !== "string" || typeof index !== "number") {
    return null;
  }
  return { columnId, index };
}

export default function KanbanBoard() {
  const columnOrder = useKanbanStore((state) => state.columnOrder);
  const setActiveTask = useKanbanStore((state) => state.setActiveTask);
  const moveTaskLocally = useKanbanStore((state) => state.moveTaskLocally);
  const store = useKanbanStoreApi();
  const { moveTask } = useKanbanActions(store);
  const preview = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    preview.current = null;
    setActiveTask(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const target = resolveTarget(event.over);
    const sourceColumnId: unknown = event.active.data.current?.columnId;
    if (!target || target.columnId === sourceColumnId) {
      return;
    }
    const taskId = String(event.active.id);
    const key = `${taskId}:${target.columnId}:${target.index}`;
    if (preview.current === key) {
      return;
    }
    preview.current = key;
    moveTaskLocally(taskId, target.columnId, target.index);
  }

  function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id);
    const target = resolveTarget(event.over);
    preview.current = null;
    setActiveTask(null);
    if (!target) {
      return;
    }
    const list = store.getState().taskIdsByColumn[target.columnId] ?? [];
    const rest = list.filter((id) => id !== taskId);
    const beforeTaskId = rest[target.index - 1] ?? null;
    const afterTaskId = rest[target.index] ?? null;
    void moveTask({
      taskId,
      toColumnId: target.columnId,
      targetIndex: target.index,
      beforeTaskId,
      afterTaskId,
    });
  }

  function handleDragCancel() {
    preview.current = null;
    setActiveTask(null);
  }

  return (
    <DndContext
      id="kanban-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div
        className="flex w-full items-start gap-4 overflow-x-auto pb-4"
        aria-label="Kanban board"
      >
        {columnOrder.map((columnId) => (
          <KanbanColumn key={columnId} columnId={columnId} />
        ))}
      </div>
      <KanbanDragOverlay />
    </DndContext>
  );
}

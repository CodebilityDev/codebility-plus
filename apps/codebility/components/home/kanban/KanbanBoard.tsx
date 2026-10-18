"use client";

import { useMemo, useRef, useState } from "react";
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

import KanbanBoardSkeleton from "@/components/home/kanban/KanbanBoardSkeleton";
import KanbanColumn from "@/components/home/kanban/KanbanColumn";
import KanbanDragOverlay from "@/components/home/kanban/KanbanDragOverlay";
import {
  COLUMN_GAP,
  COLUMN_STRIDE,
  useKanbanColumnVirtualizer,
} from "@/hooks/home/kanban/use-kanban-column-virtualizer";
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

export default function KanbanBoard({ canManage }: { canManage: boolean }) {
  const columnOrder = useKanbanStore((state) => state.columnOrder);
  const setActiveTask = useKanbanStore((state) => state.setActiveTask);
  const moveTaskLocally = useKanbanStore((state) => state.moveTaskLocally);
  const store = useKanbanStoreApi();
  const { moveTask } = useKanbanActions(store);
  const preview = useRef<string | null>(null);
  const [dragColumns, setDragColumns] = useState<{
    active: string | null;
    over: string | null;
  }>({ active: null, over: null });

  const keepMountedIds = useMemo(() => {
    const ids = new Set<string>();
    if (dragColumns.active) {
      ids.add(dragColumns.active);
    }
    if (dragColumns.over) {
      ids.add(dragColumns.over);
    }
    return ids;
  }, [dragColumns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { scrollRef, stripRef, totalSize, indexes } =
    useKanbanColumnVirtualizer({ columnOrder, keepMountedIds });

  function handleDragStart(event: DragStartEvent) {
    preview.current = null;
    const columnId: unknown = event.active.data.current?.columnId;
    setDragColumns({
      active: typeof columnId === "string" ? columnId : null,
      over: null,
    });
    setActiveTask(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const target = resolveTarget(event.over);
    const sourceColumnId: unknown = event.active.data.current?.columnId;
    if (!target) {
      return;
    }
    setDragColumns((current) =>
      current.over === target.columnId
        ? current
        : { ...current, over: target.columnId },
    );
    if (target.columnId === sourceColumnId) {
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
    setDragColumns({ active: null, over: null });
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
    setDragColumns({ active: null, over: null });
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
        ref={scrollRef}
        className="kanban-scrollbar flex min-h-0 w-full flex-1 items-stretch overflow-x-auto overflow-y-hidden px-4 pb-4"
        aria-label="Kanban board"
      >
        <div
          ref={stripRef}
          className="relative h-full shrink-0"
          style={{
            width: Math.max(totalSize - COLUMN_GAP, 0),
          }}
        >
          {indexes.length === 0 ? (
            <KanbanBoardSkeleton />
          ) : (
            indexes.map((index) => {
              const columnId = columnOrder[index];
              if (!columnId) {
                return null;
              }
              return (
                <div
                  key={columnId}
                  className="absolute top-0 h-full w-72"
                  style={{ left: index * COLUMN_STRIDE }}
                >
                  <KanbanColumn columnId={columnId} canManage={canManage} />
                </div>
              );
            })
          )}
        </div>
      </div>
      <KanbanDragOverlay />
    </DndContext>
  );
}

"use client";

import { DragOverlay } from "@dnd-kit/core";

import { KanbanTaskCardFace } from "@/components/home/kanban/KanbanTaskCard";
import { useKanbanStore } from "@/providers/home/kanban/KanbanStoreProvider";

export default function KanbanDragOverlay() {
  const activeTask = useKanbanStore((state) =>
    state.activeTaskId ? state.tasksById[state.activeTaskId] : undefined,
  );

  return (
    <DragOverlay>
      {activeTask ? (
        <div className="w-72">
          <KanbanTaskCardFace
            title={activeTask.title}
            priority={activeTask.priority}
            dueDate={activeTask.dueDate}
            dragging
          />
        </div>
      ) : null}
    </DragOverlay>
  );
}

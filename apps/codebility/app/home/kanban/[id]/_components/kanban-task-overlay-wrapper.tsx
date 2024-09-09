import { useState } from "react";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { createPortal } from "react-dom";

import KanbanTask from "./kanban-task";

export default function KanbanTaskOverlayWrapper() {
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  return (
    <>
      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {<KanbanTask task={draggedItem?.data.current?.task} />}
          </DragOverlay>,
          document.body,
        )}
    </>
  );
}

import { useState } from "react";
import { Task } from "@/types/home/codev";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { createPortal } from "react-dom";

import KanbanTask from "./KanbanTask";

interface DragData {
  type: "Task";
  task: Task;
}

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

  if (!draggedItem || !draggedItem.data.current) {
    return null;
  }

  const data = draggedItem.data.current as DragData;

  return createPortal(
    <DragOverlay>
      {data.type === "Task" && <KanbanTask task={data.task} />}
    </DragOverlay>,
    document.body,
  );
}

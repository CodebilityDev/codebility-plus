import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

interface DragAndDropHandlers {
  onDragEnd: (event: DragEndEvent) => void | Promise<void>;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
}

export function useDragAndDrop({
  onDragEnd,
  onDragStart,
  onDragOver,
}: DragAndDropHandlers) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  return {
    sensors,
    handleDragEnd: onDragEnd,
    handleDragStart: onDragStart,
    handleDragOver: onDragOver,
  };
}

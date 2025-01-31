"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KanbanColumnType, Task } from "@/types/home/codev";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import toast from "react-hot-toast";

import { updateTaskColumnId, updateTasksQueue } from "../actions";
import KanbanColumnContainer from "./kanban-column-container";
import KanbanTaskOverlayWrapper from "./kanban-task-overlay-wrapper";

interface Props {
  columns: KanbanColumnType[];
  projectId: string;
}

interface ExtendedTask extends Task {
  initialColumnId: string;
}

export default function KanbanBoardListContainer({
  columns,
  projectId,
}: Props) {
  const scrollableDiv = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<ExtendedTask[]>([]);
  const [isQueueChanged, setIsQueueChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialTasks = columns.reduce(
      (total: ExtendedTask[], column: KanbanColumnType) => {
        const columnTasks = column.tasks || [];
        const sortedTasks = columnTasks
          .map((task) => ({
            ...task,
            initialColumnId: task.kanban_column_id || "",
          }))
          .sort((a, b) => (a.points || 0) - (b.points || 0));

        return total.concat(sortedTasks);
      },
      [],
    );

    setTasks(initialTasks);
    setIsLoading(false);
  }, [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const prevColumnId = tasks[activeIndex]?.initialColumnId;
      const newColumnId = tasks[activeIndex]?.kanban_column_id;

      if (prevColumnId && newColumnId && prevColumnId !== newColumnId) {
        try {
          const updatedTask = await updateTaskColumnId(
            String(activeId),
            newColumnId,
          );
          tasks[activeIndex] = {
            ...updatedTask,
            initialColumnId: prevColumnId,
          };
        } catch (error: any) {
          toast.error(error.message || "Failed to update task column ID.");
        }
      }

      if (isQueueChanged) {
        try {
          await updateTasksQueue(tasks);
          setIsQueueChanged(false);
        } catch (error: any) {
          toast.error(error.message || "Failed to update task queue.");
        }
      }
    },
    [tasks, isQueueChanged],
  );

  const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setTasks((prevTasks = []) => {
      const activeIndex = prevTasks.findIndex((task) => task.id === activeId);
      const overIndex = prevTasks.findIndex((task) => task.id === overId);

      // Add null checks and early return
      if (activeIndex === -1 || overIndex === -1) return prevTasks;

      const updatedTasks = [...prevTasks];
      const activeTask = updatedTasks[activeIndex];
      const overTask = updatedTasks[overIndex];

      // Add null checks for the tasks
      if (!activeTask || !overTask) return prevTasks;

      activeTask.kanban_column_id = overTask.kanban_column_id;
      return arrayMove(updatedTasks, activeIndex, overIndex);
    });

    setIsQueueChanged(true);
  }, []);

  return (
    <div className="overflow-x-auto overflow-y-hidden" ref={scrollableDiv}>
      {!isLoading ? (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <ol className="flex w-full gap-2">
            {columns.map((col) => (
              <KanbanColumnContainer
                column={col}
                tasks={tasks.filter((task) => task.kanban_column_id === col.id)}
                key={col.id}
                projectId={projectId}
              />
            ))}
          </ol>
          <KanbanTaskOverlayWrapper />
        </DndContext>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

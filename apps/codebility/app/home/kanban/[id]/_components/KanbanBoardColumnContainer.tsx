"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { KanbanColumnType, Task } from "@/types/home/codev";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import toast from "react-hot-toast";

import {
  updateColumnPosition,
  updateTaskColumnId,
  updateTasksQueue,
} from "../actions";
import KanbanColumn from "./KanbanColumn";
import KanbanTaskOverlayWrapper from "./KanbanTaskOverlayWrapper";

interface Props {
  columns: KanbanColumnType[];
  projectId: string;
}

export default function KanbanBoardColumnContainer({
  columns,
  projectId,
}: Props) {
  const router = useRouter();
  const scrollableDiv = useRef<HTMLDivElement>(null);
  const [orderedColumns, setOrderedColumns] = useState(columns);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isQueueChanged, setIsQueueChanged] = useState(false);

  useEffect(() => {
    const initialTasks = columns.reduce((total: Task[], column) => {
      const columnTasks = column.tasks || [];
      return total.concat(columnTasks);
    }, []);
    setTasks(initialTasks);
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
      const activeType = active.data.current?.type;

      if (activeType === "Column") {
        const oldIndex = orderedColumns.findIndex((col) => col.id === activeId);
        const newIndex = orderedColumns.findIndex((col) => col.id === over.id);

        if (oldIndex !== newIndex) {
          const newColumns = arrayMove(orderedColumns, oldIndex, newIndex);
          setOrderedColumns(newColumns);

          // Update column positions in database
          try {
            await Promise.all(
              newColumns.map((column, index) =>
                updateColumnPosition(column.id, index),
              ),
            );
            router.refresh();
          } catch (error) {
            toast.error("Failed to update column positions");
            console.error(error);
          }
        }
        return;
      }

      if (activeType === "Task") {
        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        let newColumnId: string | null = null;
        // Try to find a task with the over.id
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) {
          newColumnId = overTask.kanban_column_id ?? null;
        }
        // Otherwise, if the over element is the tasks container in an empty column
        else if (
          typeof over.id === "string" &&
          over.id.startsWith("column-") &&
          over.id.endsWith("-tasks")
        ) {
          // Extract the column id from "column-<columnId>-tasks"
          newColumnId = over.id.substring(7, over.id.length - 6);
        }

        if (newColumnId && activeTask.kanban_column_id !== newColumnId) {
          try {
            await updateTaskColumnId(String(activeId), newColumnId);
            setTasks((prev) =>
              prev.map((task) =>
                task.id === activeId
                  ? { ...task, kanban_column_id: newColumnId }
                  : task,
              ),
            );
          } catch (error: any) {
            toast.error(error.message || "Failed to update task position");
          }
        }

        if (isQueueChanged) {
          try {
            await updateTasksQueue(tasks);
            setIsQueueChanged(false);
          } catch (error: any) {
            toast.error(error.message || "Failed to update task queue");
          }
        }
      }
    },
    [orderedColumns, tasks, isQueueChanged, router],
  );

  return (
    <div className="overflow-x-auto overflow-y-hidden" ref={scrollableDiv}>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={orderedColumns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <ol className="flex w-full gap-2 ">
            {orderedColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks.filter(
                  (task) => task.kanban_column_id === column.id,
                )}
                projectId={projectId}
              />
            ))}
          </ol>
        </SortableContext>
        <KanbanTaskOverlayWrapper />
      </DndContext>
    </div>
  );
}

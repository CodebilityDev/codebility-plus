"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

import { BoardTask, List } from "../_types/board";
import { updateTaskListId, updateTasksQueue } from "../actions";
import KanbanColumnContainer from "./kanban-column-container";
import KanbanTaskOverlayWrapper from "./kanban-task-overlay-wrapper";

interface Props {
  lists: List[];
  projectId: string;
}

export default function KanbanBoardListContainer({ lists, projectId }: Props) {
  const scrollableDiv = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [isQueueChanged, setIsQueueChanged] = useState(false); // detect whether task queue changed.
  const [isLoading, setIsLoading] = useState(true);

  // we add loading to wait for drag and drop events be registered correctly.
  useEffect(() => {
    const initialTasks = lists.reduce((total: BoardTask[], list: List) => {
      const tasks = list.task
        .map((task) => {
          task.initial_list_id = task.list_id;
          return task;
        })
        .sort((a, b) => a.row_queue - b.row_queue);
      if (Array.isArray(list.task)) total.push(...tasks);
      return total;
    }, []);

    setTasks(initialTasks);
    setIsLoading(false);
  }, [lists]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;

      const prevListId = active.data.current?.task.initial_list_id;
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const newListId = tasks[activeIndex]?.list_id;

      if (prevListId && newListId && prevListId !== newListId) {
        try {
          active.data.current = await updateTaskListId(
            String(activeId),
            newListId,
          );
          tasks[activeIndex] = active.data.current as BoardTask;
        } catch (e: any) {
          toast.error(e.message);
        }
      }

      if (!isQueueChanged) return;

      try {
        await updateTasksQueue(tasks);
        setIsQueueChanged(false); // reset changes detector
      } catch (e: any) {
        toast.error(e.message);
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

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a Task over a Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        // find the index of current dragged element in the tasks array.
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        // find the index of an element where the current dragged is over in the tasks array.
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const aTask = tasks[activeIndex];
        const oTask = tasks[overIndex];

        // check if they are not in the same column
        if (tasks[activeIndex]?.list_id !== tasks[overIndex]?.list_id) {
          if (aTask !== undefined && oTask !== undefined) {
            // make the dragged element be in the same column of where it is over.
            aTask.list_id = oTask.list_id;
          }
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });

      setIsQueueChanged(true);
    }

    // if a column have an empty task and we want to put the task we are dragging to.
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const aTask = tasks[activeIndex];
        if (aTask) {
          // assign the dragged task the list id of the column its on.
          aTask.list_id = overId.toString();
        }
        return arrayMove(tasks, activeIndex, activeIndex);
      });
      setIsQueueChanged(true);
    }
  }, []);

  return (
    <div className="overflow-x-auto overflow-y-hidden " ref={scrollableDiv}>
      {!isLoading ? (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <ol className="flex w-full gap-2">
            {lists.map((col) => (
              <KanbanColumnContainer
                column={col}
                tasks={tasks.filter((task) => task.list_id === col.id)}
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

import { TaskT } from "@/types"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragOverEvent,
  pointerWithin,
} from "@dnd-kit/core"
import { createPortal } from "react-dom"
import { useCallback, useRef, useState } from "react"
import KanbanTask from "./kanban-task"
import KanbanColumnContainer from "./kanban-column-container"
import type { Task } from "@/types/home/task"
import { List } from "../_types/board"
import useSlider from "@/hooks/useSlider"

interface Props {
  lists: List[];
  projectId: string;
}

export default function KanbanBoardListContainer({ lists, projectId }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const scrollableDiv = useRef<HTMLDivElement>(null)

  useSlider(scrollableDiv, false)

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
    })
  )

  const onDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task)
    }
  }, [])

/*   const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null)

      const { active, over } = event
      if (!over) return

      const activeId = active.id

      let prevListId = ""
      columns.forEach((col: ListT) => {
        if (col.task.some((todo: { id: number }) => todo.id === activeId)) {
          prevListId = col.id
        }
      })

      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      const newListId = tasks[activeIndex]?.listId

      if (prevListId && newListId && prevListId !== newListId) {
        const updatedData = {
          currentListId: prevListId,
          newListId: newListId,
          todoOnBoard: [{ todoBoardId: activeId }],
        }

        updateBoard2(updatedData, token)
      }
    },
    [columns, tasks, token]
  ) */

  /* const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"

    if (!isActiveATask) return

    // Dropping a Task over a Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)
        const aTask = tasks[activeIndex]
        const oTask = tasks[overIndex]
        if (tasks[activeIndex]?.listId !== tasks[overIndex]?.listId) {
          if (aTask !== undefined && oTask !== undefined) {
            aTask.listId = oTask.listId
          }
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === "Column"

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const aTask = tasks[activeIndex]
        if (aTask !== undefined) {
          aTask.listId = overId.toString()
        }

        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }, []) */
  return (
    <div className="overflow-x-auto overflow-y-hidden " ref={scrollableDiv}>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={onDragStart}
      /*   onDragEnd={onDragEnd}
        onDragOver={onDragOver} */
      >
        <ol className="flex w-full gap-2">
          {lists.map((col) => (
            <KanbanColumnContainer
              column={col}
              /* projectId={projectId} */
              key={col.id}
              projectId={projectId}
           /*    column={col}
              tasks={tasks.filter((task) => task.listId === col.id)} */
            />
          ))}
        </ol>
        {typeof window !== "undefined" &&
          createPortal(
            <DragOverlay>{activeTask && <KanbanTask task={activeTask} />}</DragOverlay>,
            document.body
          )}
      </DndContext>
    </div>
  )
}
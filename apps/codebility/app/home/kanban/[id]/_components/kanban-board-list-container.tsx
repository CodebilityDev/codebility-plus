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
import { arrayMove } from "@dnd-kit/sortable"
import KanbanTaskOverlayWrapper from "./kanban-task-overlay-wrapper"

interface Props {
  lists: List[];
  projectId: string;
}

export default function KanbanBoardListContainer({ lists, projectId }: Props) {
  const scrollableDiv = useRef<HTMLDivElement>(null)
  const [tasks, setTasks] = useState<Task[]>((lists.reduce((total: Task[], list: List) => {
    if (Array.isArray(list.task)) total.push(...list.task);
    return total;
  }, [])));

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

  const onDragOver = useCallback((event: DragOverEvent) => {
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
        // find the index of current dragged element in the tasks array.
        const activeIndex = tasks.findIndex((t) => t.id === activeId) 
        // find the index of an element where the current dragged is over in the tasks array.
        const overIndex = tasks.findIndex((t) => t.id === overId)
        const aTask = tasks[activeIndex]
        const oTask = tasks[overIndex]

        // check if they are not in the same column
        if (tasks[activeIndex]?.list_id !== tasks[overIndex]?.list_id) {
          if (aTask !== undefined && oTask !== undefined) {
            // make the dragged element be in the same column of where it is over.
            aTask.list_id = oTask.list_id
          }
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }


    // if a column have an empty task and we want to put the task we are dragging to.
    const isOverAColumn = over.data.current?.type === "Column"

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const aTask = tasks[activeIndex]
        if (aTask) {
          // assign the dragged task the list id of the column its on.
          aTask.list_id = overId.toString() 
        }
        return arrayMove(tasks, activeIndex, activeIndex)
      })
    }
  }, [])
  return (
    <div className="overflow-x-auto overflow-y-hidden " ref={scrollableDiv}>
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        // onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <ol className="flex w-full gap-2">
          {lists.map((col) => (
            <KanbanColumnContainer
              column={col}
              tasks={tasks.filter(task => task.list_id === col.id)}
              key={col.id}
              projectId={projectId}
            />
          ))}
        </ol>
        <KanbanTaskOverlayWrapper />
      </DndContext>
    </div>
  )
}
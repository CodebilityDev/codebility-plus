"use client"
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
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
import Link from "next/link"
import { updateBoard2 } from "@/app/api/kanban"
import useToken from "@/hooks/use-token"
import useSlider from "@/hooks/useSlider"
import { useModal } from "@/hooks/use-modal"
import { arrayMove } from "@dnd-kit/sortable"
import { Button } from "@/Components/ui/button"
import KanbanTask from "@/app/home/kanban/_components/kanban-task"
import { ArrowRightIcon } from "@/public/assets/svgs"
import { IconAdd, IconSearch } from "@/public/assets/svgs"
import ColumnContainer from "./kanban-column-container"
import { kanban_Kanban } from "@/types/protectedroutes"
import { ListT, TaskT } from "@/types/index"

const KanbanBoard = ({ id, data }: { id: string; data: kanban_Kanban[] }) => {
  const boardId = id
  const [activeTask, setActiveTask] = useState<TaskT | null>(null)
  const [tasks, setTasks] = useState<TaskT[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollableDiv = useRef<HTMLDivElement>(null)
  const { onOpen } = useModal()
  const { token } = useToken()

  const columns: ListT[] = useMemo(() => {
    const board = data.find((b) => b.id === boardId)
    return board ? board.lists : []
  }, [data, boardId])

  const boardName: string = useMemo(() => {
    const board = data.find((b) => b.id === boardId)
    return board ? board.name : ""
  }, [data, boardId])

  const projectId: string = useMemo(() => {
    const board = data.find((b) => b.id === boardId)

    if (board && board.boardProjects && board.boardProjects.length > 0) {
      const projectsId = board.boardProjects[0]?.projectsId
      if (projectsId !== undefined) {
        return projectsId
      } else {
        return ""
      }
    } else {
      return ""
    }
  }, [data, boardId])

  useEffect(() => {
    setIsLoading(true)

    const board = data.find((b) => b.id === boardId)

    if (board && Array.isArray(board.lists)) {
      const tempTasks = board.lists.reduce((acc: TaskT[], col: ListT) => {
        if (Array.isArray(col.task)) {
          // <-- Error here
          acc.push(...col.task)
        }
        return acc
      }, [])

      if (tempTasks) {
        setTasks(tempTasks)
      }
    } else {
      setTasks([])
    }

    setIsLoading(false)
  }, [data, boardId])

  useSlider(scrollableDiv, isLoading)

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

  const onDragEnd = useCallback(
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
  )

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
  }, [])

  return (
    <div className="flex h-full w-full">
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col ">
        <div className="text-dark100_light900 flex h-full flex-col gap-4">
          <div className="flex flex-row items-center gap-4 text-sm">
            <Link href={"/kanban"}>
              <span className="dark:text-white/50">Kanban Board</span>
            </Link>
            <ArrowRightIcon />
            <span>{boardName}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-dark100_light900 text-md font-semibold md:text-2xl">{boardName}</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 rounded-md bg-light-900 border border-zinc-300 dark:border-zinc-500 dark:bg-[#2C303A] px-2">
                <label htmlFor="kanbanSearch">
                  <IconSearch />
                </label>
                <input
                  className="w-32 bg-transparent outline-none"
                  type="text"
                  name="kanbanSearch"
                  id="kanbanSearch"
                  placeholder="Search"
                />
              </div>
              <Button variant="default" className="flex" onClick={() => onOpen("listAddModal", boardId)}>
                <div className="flex items-center gap-2">
                  <IconAdd />
                  <p>Add new list</p>
                </div>
              </Button>
            </div>
          </div>
          {!isLoading ? (
            <div className="text-dark100_light900 flex h-full">
              <div className="overflow-x-auto overflow-y-hidden " ref={scrollableDiv}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={pointerWithin}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                >
                  <ol className="flex w-full gap-2">
                    {columns.map((col) => (
                      <ColumnContainer
                        projectId={projectId}
                        key={col.id}
                        column={col}
                        tasks={tasks.filter((task) => task.listId === col.id)}
                      />
                    ))}
                  </ol>
                  {typeof window !== "undefined" &&
                    createPortal(
                      <DragOverlay>{activeTask && <KanbanTask task={activeTask} listName="" />}</DragOverlay>,
                      document.body
                    )}
                </DndContext>
              </div>
            </div>
          ) : (
            "Loading"
          )}
        </div>
      </div>
    </div>
  )
}

export default KanbanBoard

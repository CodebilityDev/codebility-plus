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
import KanbanTask from "./kanban-task"
import { ArrowRightIcon } from "@/public/assets/svgs"
import { IconAdd, IconSearch } from "@/public/assets/svgs"
import ColumnContainer from "./kanban-column-container"
import { kanban_Kanban } from "@/types/protectedroutes"
import { ListT, TaskT } from "@/types/index"
import pathsConfig from "@/config/paths.config"
import { Board } from "../_types/board"
import KanbanListAddModal from "./kanban-list-add-modal"
import KanbanBoardListContainer from "./kanban-board-list-container"

interface Props {
  boardData: Board;
}

const KanbanBoard = ({ boardData }: Props) => {
  const [activeTask, setActiveTask] = useState<TaskT | null>(null)
  const [tasks, setTasks] = useState<TaskT[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const scrollableDiv = useRef<HTMLDivElement>(null)

/*   const columns: ListT[] = useMemo(() => {
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
  }, [data, boardId]) */

  /* useEffect(() => {
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
*/

  return (
    <div className="flex h-full w-full">
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col ">
        <div className="text-dark100_light900 flex h-full flex-col gap-4">
          <div className="flex flex-row items-center gap-4 text-sm">
            <Link href={pathsConfig.app.kanban}>
              <span className="dark:text-white/50">Kanban Board</span>
            </Link>
            <ArrowRightIcon />
            <span>{boardData.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-dark100_light900 text-md font-semibold md:text-2xl">{boardData.name}</div>
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
              <KanbanListAddModal boardId={boardData.id}/>
            </div>
          </div>
          {!isLoading ? (
            <div className="text-dark100_light900 flex h-full">
              <KanbanBoardListContainer lists={boardData.list} />
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

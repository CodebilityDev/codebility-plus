import Link from "next/link"
import { ArrowRightIcon } from "@/public/assets/svgs"
import { IconSearch } from "@/public/assets/svgs"
import pathsConfig from "@/config/paths.config"
import { Board } from "../_types/board"
import KanbanListAddModal from "./kanban_modals/kanban-list-add-modal"
import KanbanBoardListContainer from "./kanban-board-list-container"
import KanbanBoardsSearch from "../../_components/kanban-boards-search"

interface Props {
  boardData: Board;
}

const KanbanBoard = ({ boardData }: Props) => {

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
                <KanbanBoardsSearch className="w-32 bg-transparent outline-none" placeholder="Search"/>
              </div>
              <KanbanListAddModal boardId={boardData.id}/>
            </div>
          </div>
          <div className="text-dark100_light900 flex h-full">
              <KanbanBoardListContainer projectId={boardData.project_id} lists={boardData.list} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default KanbanBoard

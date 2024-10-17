import Link from "next/link";
import pathsConfig from "@/config/paths.config";
import { ArrowRightIcon, IconSearch } from "@/public/assets/svgs";

import { Board } from "../_types/board";
import KanbanBoardsSearch from "../../_components/kanban-boards-search";
import KanbanListAddModal from "./kanban_modals/kanban-list-add-modal";
import KanbanBoardListContainer from "./kanban-board-list-container";

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
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="text-dark100_light900 text-md font-semibold md:text-2xl">
              {boardData.name}
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="w-full bg-light-900 flex items-center gap-3 rounded-md border border-zinc-300 p-2 dark:border-zinc-500 dark:bg-[#2C303A]">
                <label htmlFor="kanbanSearch">
                  <IconSearch />
                </label>
                <KanbanBoardsSearch
                  className=" bg-transparent outline-none"
                  placeholder="Search"
                />
              </div>
              <KanbanListAddModal boardId={boardData.id} />
            </div>
          </div>
          <div className="text-dark100_light900 flex h-full">
            <KanbanBoardListContainer
              projectId={boardData.project_id}
              lists={boardData.list}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

import Link from "next/link";
import pathsConfig from "@/config/paths.config";
import { ArrowRightIcon, IconSearch } from "@/public/assets/svgs";
import { KanbanBoardType, KanbanColumnType } from "@/types/home/codev";

import KanbanBoardsSearch from "../../_components/kanban-boards-search";
import KanbanListAddModal from "./kanban_modals/kanban-list-add-modal";
import KanbanBoardListContainer from "./kanban-board-list-container";

interface Props {
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] };
}

const KanbanBoard = ({ boardData }: Props) => {
  if (!boardData) {
    return (
      <div className="text-center text-red-500">Board data not found.</div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col">
        <div className="text-dark100_light900 flex h-full flex-col gap-4">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-row items-center gap-4 text-sm">
            <Link href={pathsConfig.app.kanban}>
              <span className="dark:text-white/50">Kanban Board</span>
            </Link>
            <ArrowRightIcon />
            <span className="font-semibold">{boardData.name}</span>
          </div>

          {/* Board Title and Actions */}
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="text-dark100_light900 text-md font-semibold md:text-2xl">
              {boardData.name}
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Search Bar */}
              <div className="bg-light-900 flex w-full items-center gap-3 rounded-md border border-zinc-300 p-2 dark:border-zinc-500 dark:bg-[#2C303A]">
                <label htmlFor="kanbanSearch">
                  <IconSearch />
                </label>
                <KanbanBoardsSearch
                  className="bg-transparent outline-none"
                  placeholder="Search"
                  id="kanbanSearch"
                />
              </div>

              {/* Add Column Modal */}
              <KanbanListAddModal boardId={boardData.id} />
            </div>
          </div>

          {/* Board Columns */}
          <div className="text-dark100_light900 flex h-full">
            <KanbanBoardListContainer
              projectId={boardData.id}
              columns={boardData.kanban_columns || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;

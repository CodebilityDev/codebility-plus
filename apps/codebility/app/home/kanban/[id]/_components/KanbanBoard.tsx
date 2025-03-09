"use client";

import Link from "next/link";
import pathsConfig from "@/config/paths.config";
import { ArrowRightIcon, IconSearch } from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
import { KanbanBoardType, KanbanColumnType } from "@/types/home/codev";

import KanbanBoardsSearch from "../../_components/KanbanBoardsSearch";
import KanbanColumnAddButton from "./kanban_modals/KanbanColumnAddButton";
import KanbanColumnAddModal from "./kanban_modals/KanbanColumnAddModal";
import KanbanBoardColumnContainer from "./KanbanBoardColumnContainer";

interface KanbanBoardProps {
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] };
}

export default function KanbanBoard({ boardData }: KanbanBoardProps) {
  const user = useUserStore((state) => state.user);
  const canAddColumn = user?.role_id === 1 || user?.role_id === 5;

  if (!boardData) {
    return (
      <div className="text-center text-red-500">Board data not found.</div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col">
        <div className="text-dark100_light900 flex h-full flex-col gap-4">
          {/* Breadcrumb */}
          <div className="flex flex-row items-center gap-4 text-sm">
            <Link href={pathsConfig.app.kanban}>
              <span className="dark:text-white/50">Kanban Board</span>
            </Link>
            <ArrowRightIcon />
            <span className="font-semibold">{boardData.name}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <h1 className="text-dark100_light900 text-md font-semibold md:text-2xl">
              {boardData.name}
            </h1>

            <div className="flex flex-col gap-4 md:flex-row">
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

              {canAddColumn && <KanbanColumnAddButton boardId={boardData.id} />}
            </div>
          </div>

          {/* Board Content */}
          <div className="text-dark100_light900 flex h-full">
            <KanbanBoardColumnContainer
              projectId={boardData.id}
              columns={boardData.kanban_columns || []}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {canAddColumn && <KanbanColumnAddModal />}
    </div>
  );
}

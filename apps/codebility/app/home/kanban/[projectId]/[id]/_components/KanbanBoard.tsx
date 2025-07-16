"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KanbanBoardsSearch from "@/app/home/kanban/_components/KanbanBoardsSearch";
import { getMembers } from "@/app/home/projects/actions";
import pathsConfig from "@/config/paths.config";
import { ArrowRightIcon, IconSearch, IconArchive } from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
import { KanbanBoardType, KanbanColumnType } from "@/types/home/codev";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@codevs/ui/button";

import KanbanAddMembersButton from "./kanban_modals/KanbanAddMembersButton";
import KanbanColumnAddButton from "./kanban_modals/KanbanColumnAddButton";
import KanbanColumnAddModal from "./kanban_modals/KanbanColumnAddModal";
import KanbanBoardColumnContainer from "./KanbanBoardColumnContainer";
import UserTaskFilter from "./UserTaskFilter";
import ArchiveColumn from "./ArchiveColumn";


interface KanbanBoardProps {
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] };
  projectId: string;
}

export default function KanbanBoard({
  boardData,
  projectId,
}: KanbanBoardProps) {
  const user = useUserStore((state) => state.user);
  const canAddColumn = user?.role_id === 1 || user?.role_id === 5;
  const canAddMember = canAddColumn;

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  // Fetch all project members using React Query
  const { data: allMembers = [], isLoading: isMembersLoading } = useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const result = await getMembers(projectId);
      return result.data || [];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const members = allMembers.map((user) => ({
    userId: user.id,
    userName: `${user.first_name} ${user.last_name}`,
    imageUrl: user.image_url,
    isActive: activeFilter === user.id,
  }));

  const handleFilterClick = (userId: string) => {
    setActiveFilter(activeFilter === userId ? null : userId);
  };

  if (!boardData) {
    return (
      <div className="text-center text-red-500">Board data not found.</div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col">
        <div className="text-dark100_light900 flex h-full flex-col gap-4">
          <div className="flex flex-row items-center gap-4 text-sm">
            <Link href={pathsConfig.app.kanban}>
              <span className="dark:text-white/50">Kanban Board</span>
            </Link>
            <ArrowRightIcon />
            <span className="font-semibold">{boardData.name}</span>
          </div>

          <div className="flex flex-col gap-4 md:justify-between lg:flex-row">
            <h1 className="text-dark100_light900 text-md font-semibold md:text-2xl">
              {boardData.name}
            </h1>

            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="h-10 overflow-visible">
                  <UserTaskFilter
                    members={members}
                    onFilterClick={handleFilterClick}
                  />
                </div>

                <div className="bg-light-900 flex w-[280px] items-center gap-3 rounded-md border border-zinc-300 p-2 dark:border-zinc-500 dark:bg-[#2C303A]">
                  <label htmlFor="kanbanSearch">
                    <IconSearch />
                  </label>
                  <KanbanBoardsSearch
                    className="w-full bg-transparent outline-none"
                    placeholder="Search"
                    id="kanbanSearch"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 md:justify-start">
                {canAddColumn && (
                  <KanbanColumnAddButton boardId={boardData.id} />
                )}
                {canAddMember && <KanbanAddMembersButton />}
                <Button
                  onClick={() => setShowArchive(!showArchive)}
                  variant={showArchive ? "default" : "outline"}
                  className={`flex items-center gap-2 ${
                    showArchive 
                      ? "bg-blue-100 text-white hover:bg-blue-200 dark:bg-blue-100 dark:text-white dark:hover:bg-blue-200" 
                      : "border-lightgray text-black-100 hover:bg-lightgray dark:border-darkgray dark:text-white dark:hover:bg-darkgray"
                  }`}
                >
                  <IconArchive className="h-4 w-4" />
                  {showArchive ? "Hide Archive" : "Show Archive"}
                </Button>
              </div>
            </div>
          </div>

          {boardData.kanban_columns.length === 0 ? (
            <div className="text-dark100_light900 py-10 text-center text-lg">
              No columns found in this board.
            </div>
          ) : (
            <div className="text-dark100_light900 flex h-full">
              {!showArchive ? (
                <KanbanBoardColumnContainer
                  projectId={boardData.id}
                  columns={boardData.kanban_columns || []}
                  activeFilter={activeFilter}
                />
              ) : (
                <ArchiveColumn projectId={projectId} boardId={boardData.id} />
              )}
            </div>
          )}
        </div>
      </div>

      {canAddColumn && <KanbanColumnAddModal />}
    </div>
  );
}

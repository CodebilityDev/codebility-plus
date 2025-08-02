"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import KanbanBoardsSearch from "@/app/home/kanban/_components/KanbanBoardsSearch";
import { getMembers } from "@/app/home/projects/actions";
import pathsConfig from "@/config/paths.config";
import { ArrowRightIcon, IconArchive, IconSearch } from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
import { KanbanBoardType, KanbanColumnType } from "@/types/home/codev";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@codevs/ui/button";

import ArchiveColumn from "./ArchiveColumn";
import KanbanAddMembersButton from "./kanban_modals/KanbanAddMembersButton";
import KanbanColumnAddButton from "./kanban_modals/KanbanColumnAddButton";
import KanbanColumnAddModal from "./kanban_modals/KanbanColumnAddModal";
import KanbanBoardColumnContainer from "./KanbanBoardColumnContainer";
import UserTaskFilter from "./UserTaskFilter";

interface KanbanBoardProps {
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] };
  projectId: string;
}

function KanbanBoard({ boardData, projectId }: KanbanBoardProps) {
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

  const members = useMemo(
    () =>
      allMembers.map((user) => ({
        userId: user.id,
        userName: `${user.first_name} ${user.last_name}`,
        imageUrl: user.image_url,
        isActive: activeFilter === user.id,
      })),
    [allMembers, activeFilter],
  );

  const handleFilterClick = useCallback((userId: string) => {
    setActiveFilter((prev) => (prev === userId ? null : userId));
  }, []);

  if (!boardData) {
    return (
      <div className="text-center text-red-500">Board data not found.</div>
    );
  }

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="relative z-10 mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col">
        <div className="flex h-full flex-col gap-6 p-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-row items-center gap-3 text-sm">
            <Link href={pathsConfig.app.kanban} className="group">
              <span className="group-hover:text-customBlue-600 dark:group-hover:text-customBlue-400 text-gray-500 transition-colors duration-200 dark:text-gray-400">
                📋 Kanban Board
              </span>
            </Link>
            <ArrowRightIcon className="text-gray-400 dark:text-gray-500" />
            <span className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text font-semibold text-gray-900 text-transparent dark:text-white">
              {boardData.name}
            </span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col gap-6 md:justify-between lg:flex-row">
            <div className="flex items-center gap-4">
              <div className="from-customBlue-500 shadow-customBlue-500/25 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-gradient-to-br to-purple-500 shadow-xl [animation-duration:3s]">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text text-2xl font-bold text-transparent drop-shadow-sm md:text-3xl">
                  {boardData.name}
                </h1>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Organize and track your project tasks efficiently
                </p>
              </div>
            </div>

            {/* Search Section - Full Width */}
            <div className="flex flex-col gap-4">
              <div className="focus-within:ring-customBlue-500 focus-within:border-customBlue-300 flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 focus-within:shadow-xl focus-within:ring-2 hover:bg-white dark:border-gray-600 dark:bg-gray-800/80">
                <label htmlFor="kanbanSearch">
                  <IconSearch className="text-gray-400 transition-colors duration-200 dark:text-gray-500" />
                </label>
                <KanbanBoardsSearch
                  className="w-full bg-transparent font-medium text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
                  placeholder="🔍 Search tasks..."
                  id="kanbanSearch"
                />
              </div>

              {/* Controls Section */}
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="h-10 overflow-visible">
                  <UserTaskFilter
                    members={members}
                    onFilterClick={handleFilterClick}
                  />
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:gap-3">
                  {canAddColumn && (
                    <KanbanColumnAddButton boardId={boardData.id} />
                  )}
                  {canAddMember && <KanbanAddMembersButton />}
                  <Button
                    onClick={() => setShowArchive(!showArchive)}
                    variant={showArchive ? "default" : "outline"}
                    className={`flex transform items-center gap-2 whitespace-nowrap px-3 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                      showArchive
                        ? "bg-customBlue-600 hover:bg-customBlue-700 shadow-customBlue-500/30 text-white shadow-lg"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <IconArchive className="h-4 w-4" />
                    <span className="hidden lg:inline">
                      {showArchive ? "Hide Archive" : "Show Archive"}
                    </span>
                    <span className="lg:hidden">
                      {showArchive ? "Hide" : "Archive"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {boardData.kanban_columns.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="py-20 text-center">
                <div className="mb-6 animate-bounce text-6xl opacity-60 [animation-duration:2s]">
                  📋
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  No columns found
                </h3>
                <p className="mx-auto max-w-md leading-relaxed text-gray-600 dark:text-gray-400">
                  Get started by adding your first column to organize your tasks
                  and boost productivity.
                </p>
                {canAddColumn && (
                  <div className="mt-8">
                    <KanbanColumnAddButton boardId={boardData.id} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-1 overflow-hidden rounded-xl bg-transparent backdrop-blur-sm transition-all duration-300">
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

export default memo(KanbanBoard);

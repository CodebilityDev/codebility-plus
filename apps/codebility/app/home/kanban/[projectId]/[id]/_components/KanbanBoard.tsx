"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
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

function KanbanBoard({
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

  const members = useMemo(() => allMembers.map((user) => ({
    userId: user.id,
    userName: `${user.first_name} ${user.last_name}`,
    imageUrl: user.image_url,
    isActive: activeFilter === user.id,
  })), [allMembers, activeFilter]);

  const handleFilterClick = useCallback((userId: string) => {
    setActiveFilter(prev => prev === userId ? null : userId);
  }, []);

  if (!boardData) {
    return (
      <div className="text-center text-red-500">Board data not found.</div>
    );
  }

  return (
    <div className="flex h-full w-full relative overflow-hidden">
      
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col relative z-10">
        <div className="flex h-full flex-col gap-6 p-6">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-row items-center gap-3 text-sm">
            <Link href={pathsConfig.app.kanban} className="group">
              <span className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                📋 Kanban Board
              </span>
            </Link>
            <ArrowRightIcon className="text-gray-400 dark:text-gray-500" />
            <span className="font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {boardData.name}
            </span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col gap-6 md:justify-between lg:flex-row">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-blue-500/25 animate-pulse [animation-duration:3s]">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                  {boardData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Organize and track your project tasks efficiently</p>
              </div>
            </div>

            {/* Search Section - Full Width */}
            <div className="flex flex-col gap-4">
              <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm p-3 shadow-lg transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-300 focus-within:shadow-xl hover:bg-white dark:border-gray-600 dark:bg-gray-800/80">
                <label htmlFor="kanbanSearch">
                  <IconSearch className="text-gray-400 dark:text-gray-500 transition-colors duration-200" />
                </label>
                <KanbanBoardsSearch
                  className="w-full bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-medium"
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
                    className={`flex items-center gap-2 transition-all duration-300 transform hover:scale-105 text-sm px-3 py-2 whitespace-nowrap ${
                      showArchive 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <IconArchive className="h-4 w-4" />
                    <span className="hidden lg:inline">{showArchive ? "Hide Archive" : "Show Archive"}</span>
                    <span className="lg:hidden">{showArchive ? "Hide" : "Archive"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {boardData.kanban_columns.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-20">
                <div className="text-6xl mb-6 opacity-60 animate-bounce [animation-duration:2s]">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No columns found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Get started by adding your first column to organize your tasks and boost productivity.
                </p>
                {canAddColumn && (
                  <div className="mt-8">
                    <KanbanColumnAddButton boardId={boardData.id} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-1 rounded-xl bg-transparent backdrop-blur-sm overflow-hidden transition-all duration-300">
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

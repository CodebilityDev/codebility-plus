"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { useKanbanTaskUrlModal } from "@/hooks/useKanbanTaskUrlModal";

interface KanbanBoardProps {
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] };
  projectId: string;
}

/**
 * Enhanced KanbanBoard component with three-level breadcrumb navigation
 * Follows KISS, YAGNI, DRY, and SOLID principles
 * Maintains all existing functionality while adding proper navigation structure
 */
function KanbanBoard({ boardData, projectId }: KanbanBoardProps) {
  const user = useUserStore((state) => state.user);

  // Sync the Kanban task modal with the URL ?taskId param
  useKanbanTaskUrlModal(boardData);

  // User permissions - simple boolean checks following YAGNI principle
  const canAddColumn = user?.role_id === 1 || user?.role_id === 5;
  const canAddMember = canAddColumn;

  // Component state - minimal and focused
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);

  // Fetch project members using React Query for caching and optimization
  const { data: allMembers = [], isLoading: isMembersLoading } = useQuery({
    queryKey: ["members", projectId],
    queryFn: async () => {
      const result = await getMembers(projectId);
      return result.data || [];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  // Transform members data using useMemo for performance optimization
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

  // Filter handler using useCallback to prevent unnecessary re-renders
  const handleFilterClick = useCallback((userId: string) => {
    setActiveFilter((prev) => (prev === userId ? null : userId));
  }, []);

  // Early return for missing data - fail fast principle
  if (!boardData) {
    return (
      <div className="text-center text-red-500">Board data not found.</div>
    );
  }

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="relative z-10 h-full w-full flex-1 flex-col">
        <div className="flex h-full flex-col gap-6 p-6">
          {/* Three-Level Breadcrumb Navigation */}
          <nav
            className="flex flex-row items-center gap-3 text-sm"
            aria-label="Breadcrumb"
          >
            {/* Level 1: Kanban Board Overview */}
            <Link
              href={pathsConfig.app.kanban}
              className="group transition-colors duration-200"
            >
              <span className="group-hover:text-customBlue-600 dark:group-hover:text-customBlue-400 text-gray-500 dark:text-gray-400">
                📋 Kanban Board
              </span>
            </Link>

            <ArrowRightIcon
              className="text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />

            {/* Level 2: Project Sprint */}
            <Link
              href={`${pathsConfig.app.kanban}/${projectId}`}
              className="group transition-colors duration-200"
            >
              <span className="group-hover:text-customBlue-600 dark:group-hover:text-customBlue-400 text-gray-500 dark:text-gray-400">
                Kanban Sprint
              </span>
            </Link>

            <ArrowRightIcon
              className="text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />

            {/* Level 3: Current Board Name */}
            <span
              className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text font-semibold text-gray-900 text-transparent dark:text-white"
              aria-current="page"
            >
              {boardData.name}
            </span>
          </nav>

          {/* Header Section */}
          <header className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="from-customBlue-500 shadow-customBlue-500/25 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-gradient-to-br to-purple-500 shadow-xl [animation-duration:3s]">
                <span className="text-2xl" aria-hidden="true">
                  📋
                </span>
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

            {/* Desktop Layout: Search Left, Controls Right */}
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">
              {/* Left: Search Input */}
              <div className="flex-1">
                <div className="focus-within:ring-customBlue-500 focus-within:border-customBlue-300 flex w-full items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 focus-within:shadow-xl focus-within:ring-2 hover:bg-white/20 dark:border-white/10 dark:bg-white/5">
                  <label htmlFor="kanbanSearch" className="sr-only">
                    Search tasks
                  </label>
                  <IconSearch
                    className="text-gray-300 transition-colors duration-200 dark:text-gray-400"
                    aria-hidden="true"
                  />
                  <KanbanBoardsSearch
                    className="w-full bg-transparent font-medium text-white placeholder-gray-300 outline-none dark:text-white dark:placeholder-gray-400"
                    placeholder="🔍 Search tasks..."
                    id="kanbanSearch"
                  />
                </div>
              </div>

              {/* Right: Buttons and Members */}
              <div className="flex flex-col gap-4 lg:flex-col lg:items-end">
                {/* Action Buttons Section */}
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  {canAddColumn && (
                    <KanbanColumnAddButton boardId={boardData.id} />
                  )}
                  {canAddMember && <KanbanAddMembersButton />}

                  {/* Archive Toggle Button */}
                  <Button
                    onClick={() => setShowArchive(!showArchive)}
                    variant={showArchive ? "default" : "outline"}
                    className={`flex transform items-center gap-2 whitespace-nowrap px-3 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                      showArchive
                        ? "bg-customBlue-600 hover:bg-customBlue-700 shadow-customBlue-500/30 text-white shadow-lg"
                        : "border-white/30 text-white hover:border-white/50 hover:bg-white/20 dark:border-white/20 dark:text-gray-300 dark:hover:bg-white/10 backdrop-blur-sm"
                    }`}
                    aria-pressed={showArchive}
                  >
                    <IconArchive className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden lg:inline">
                      {showArchive ? "Hide Archive" : "Show Archive"}
                    </span>
                    <span className="lg:hidden">
                      {showArchive ? "Hide" : "Archive"}
                    </span>
                  </Button>
                </div>

                {/* User Filter Section */}
                <div className="min-h-10 overflow-visible">
                  <UserTaskFilter
                    members={members}
                    onFilterClick={handleFilterClick}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1">
            {boardData.kanban_columns.length === 0 ? (
              // Empty State
              <div className="flex flex-1 items-center justify-center">
                <div className="py-20 text-center">
                  <div
                    className="mb-6 animate-bounce text-6xl opacity-60 [animation-duration:2s]"
                    aria-hidden="true"
                  >
                    📋
                  </div>
                  <h2 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                    No columns found
                  </h2>
                  <p className="mx-auto max-w-md leading-relaxed text-gray-600 dark:text-gray-400">
                    Get started by adding your first column to organize your
                    tasks and boost productivity.
                  </p>
                  {canAddColumn && (
                    <div className="mt-8">
                      <KanbanColumnAddButton boardId={boardData.id} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Kanban Board Content
              <div className="flex h-full flex-1 overflow-hidden rounded-xl bg-transparent backdrop-blur-sm transition-all duration-300">
                {!showArchive ? (
                  <KanbanBoardColumnContainer
                    projectId={projectId}
                    columns={boardData.kanban_columns || []}
                    activeFilter={activeFilter}
                  />
                ) : (
                  <ArchiveColumn projectId={projectId} boardId={boardData.id} />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal Container */}
      {canAddColumn && <KanbanColumnAddModal />}
    </div>
  );
}

export default memo(KanbanBoard);

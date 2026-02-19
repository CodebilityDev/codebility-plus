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
import toast from "react-hot-toast";
import { Archive } from "lucide-react";

import { Button } from "@codevs/ui/button";

import ArchiveColumn from "./ArchiveColumn";
import KanbanAddMembersButton from "./kanban_modals/KanbanAddMembersButton";
import KanbanColumnAddButton from "./kanban_modals/KanbanColumnAddButton";
import KanbanColumnAddModal from "./kanban_modals/KanbanColumnAddModal";
import KanbanBoardColumnContainer from "./KanbanBoardColumnContainer";
import UserTaskFilter from "./UserTaskFilter";
import { useKanbanTaskUrlModal } from "@/hooks/useKanbanTaskUrlModal";
import { getDraftCount } from "../actions";

interface KanbanBoardProps {
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] };
  projectId: string;
}

function KanbanBoard({ boardData, projectId }: KanbanBoardProps) {
  const user = useUserStore((state) => state.user);

  useKanbanTaskUrlModal(boardData);

  const canAddColumn = user?.role_id === 1 || user?.role_id === 5;
  const canAddMember = canAddColumn;

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false);
  const [draftCount, setDraftCount] = useState<number>(0);

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

  useEffect(() => {
    if (user?.id && projectId) {
      loadDraftCount();
    }
  }, [user?.id, projectId]);

  const loadDraftCount = async () => {
    if (!user?.id || !projectId) return;
    const result = await getDraftCount(projectId, user.id);
    if (result.success && result.count !== undefined) {
      setDraftCount(result.count);
    }
  };

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
      <div className="relative z-10 h-full w-full flex-1 flex-col">
        <div className="flex h-full flex-col gap-6 p-6">
          {/* Three-Level Breadcrumb Navigation */}
          <nav
            className="flex flex-row items-center gap-3 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href={pathsConfig.app.kanban}
              className="group transition-colors duration-200"
            >
              <span className="text-gray-500 group-hover:text-customBlue-600 dark:text-gray-400 dark:group-hover:text-customBlue-400">
                📋 Kanban Board
              </span>
            </Link>

            <ArrowRightIcon
              className="text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />

            <Link
              href={`${pathsConfig.app.kanban}/${projectId}`}
              className="group transition-colors duration-200"
            >
              <span className="text-gray-500 group-hover:text-customBlue-600 dark:text-gray-400 dark:group-hover:text-customBlue-400">
                Kanban Sprint
              </span>
            </Link>

            <ArrowRightIcon
              className="text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            />

            <span
              className="bg-gradient-to-r from-purple-600 to-customBlue-600 bg-clip-text font-semibold text-transparent"
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
                <h1 className="bg-gradient-to-r from-purple-600 to-customBlue-600 bg-clip-text text-2xl font-bold text-transparent drop-shadow-sm md:text-3xl">
                  {boardData.name}
                </h1>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Organize and track your project tasks efficiently
                </p>
              </div>
            </div>

            {/* Desktop Layout: Search Left, Controls Right */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
              {/* Left: Search Input */}
              <div className="flex-1">
                <div className="focus-within:ring-customBlue-500 focus-within:border-customBlue-300 flex w-full items-center gap-3 rounded-xl border p-3 shadow-lg backdrop-blur-sm transition-all duration-300 focus-within:shadow-xl focus-within:ring-2
                  border-gray-200 bg-white hover:bg-gray-50
                  dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                  <label htmlFor="kanbanSearch" className="sr-only">
                    Search tasks
                  </label>
                  <IconSearch
                    className="text-gray-400 transition-colors duration-200 dark:text-gray-400"
                    aria-hidden="true"
                  />
                  <KanbanBoardsSearch
                    className="w-full bg-transparent font-medium outline-none
                      text-gray-800 placeholder-gray-400
                      dark:text-white dark:placeholder-gray-400"
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

                  {/* Archive Toggle Button - FIXED for light mode */}
                  <Button
                    onClick={() => setShowArchive(!showArchive)}
                    variant={showArchive ? "default" : "outline"}
                    className={`flex transform items-center gap-2 whitespace-nowrap px-3 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                      showArchive
                        ? "bg-customBlue-600 hover:bg-customBlue-700 shadow-customBlue-500/30 text-white shadow-lg"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-100 dark:border-white/20 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/10 backdrop-blur-sm"
                    }`}
                    aria-pressed={showArchive}
                  >
                    <Archive className="h-4 w-4 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                    <span className="hidden lg:inline">
                      {showArchive ? "Hide Archive" : "Show Archive"}
                    </span>
                    <span className="lg:hidden">
                      {showArchive ? "Hide" : "Archive"}
                    </span>
                  </Button>

                  {/* Draft Badge Button - FIXED for light mode */}
                  {draftCount > 0 && (
                    <Button
                      onClick={() => {
                        toast("💡 Click 'Add Task' in any column to access your drafts", {
                          duration: 3000,
                          icon: "📝",
                        });
                      }}
                      variant="outline"
                      className="relative flex transform items-center gap-2 whitespace-nowrap px-3 py-2 text-sm transition-all duration-300 hover:scale-105
                        border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-100
                        dark:border-white/20 dark:bg-transparent dark:text-gray-300 dark:hover:bg-white/10 backdrop-blur-sm"
                      aria-label={`You have ${draftCount} draft${draftCount > 1 ? 's' : ''}`}
                      title="View your saved drafts"
                    >
                      <span className="text-lg" aria-hidden="true">📝</span>
                      <span className="hidden lg:inline">Drafts</span>
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white shadow-lg">
                        {draftCount}
                      </span>
                    </Button>
                  )}
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

      {canAddColumn && <KanbanColumnAddModal />}
    </div>
  );
}

export default memo(KanbanBoard);
// page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { Box } from "@/components/shared/dashboard";
import H1 from "@/components/shared/dashboard/H1";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import pathsConfig from "@/config/paths.config";
import { IconKanban } from "@/public/assets/svgs";
import { createClientServerComponent } from "@/utils/supabase/server";

import KanbanBoardsSearch from "./_components/KanbanBoardsSearch";

export const dynamic = "force-dynamic";
export const revalidate = 0;
// Types
interface SearchParams {
  query?: string;
}

interface CodevData {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface ProjectMemberData {
  codev?: CodevData;
  role?: string;
}

interface ProjectData {
  id: string;
  name: string;
  client_id?: string;
  team_leader_id?: string;
  project_members?: ProjectMemberData[];
  codev?: CodevData;
  kanban_display: boolean;
  isUserInvolved?: boolean;
}

interface KanbanBoardData {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  project_id?: string;
  projects?: ProjectData | null;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function KanbanPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const supabase = await createClientServerComponent();

  //Get current user
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  const currentUserId = sessionUser?.id;

  // Construct the initial board query
  let boardQuery = supabase.from("kanban_boards").select(`
    id,
    name,
    description,
    created_at,
    updated_at,
    project_id,
    projects (
      id,
      name,
      client_id,
      kanban_display,
      project_members (
        role,
        codev (
          id,
          first_name,
          last_name,
          image_url
          
        )
      )
    )
  `);

  // Apply search filter if query exists
  if (searchParams.query) {
    boardQuery = boardQuery.ilike("name", `%${searchParams.query}%`);
  }

  // Execute the query
  const { data: boards, error } = await boardQuery;
  const typedBoards = boards as KanbanBoardData[] | null;

  // Fetch team leads for each board
  const boardsWithTeamLeads = (typedBoards || []).map((board) => {
    const project = board.projects;

    if (!project || !project.project_members) return board;

    const teamLeader = project.project_members.find(
      (member) => member.role === "team_leader" && member.codev,
    );

    const isUserInvolved = Array.isArray(board.projects?.project_members)
      ? board.projects.project_members.some(
          (member) => member.codev?.id === currentUserId,
        )
      : false;

    return {
      ...board,
      projects: {
        ...(board.projects || {}),
        codev: teamLeader?.codev || null,
        isUserInvolved,
      },
    };
  });

  // Render table content
  const renderTableContent = () => {
    // Error handling
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-red-500">
            {error.message || "Error loading boards"}
          </TableCell>
        </TableRow>
      );
    }

    // Loading state
    if (!typedBoards) {
      return Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`loading-${index}`}>
          <TableCell colSpan={4}>
            <Box className="flex-1">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-8 w-full" />
              </div>
            </Box>
          </TableCell>
        </TableRow>
      ));
    }

    // Empty state
    if (!typedBoards || typedBoards.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={4}
            className="text-dark100_light900 py-8 text-center"
          >
            No boards available. Create a board to get started.
          </TableCell>
        </TableRow>
      );
    }

    const view_sprint: React.ReactNode = (
      <Button
        variant="hollow"
        className="inline-flex items-center gap-2 bg-[#000000] text-white hover:opacity-100 dark:bg-[#000000]"
      >
        <IconKanban className="h-4 w-4 text-white" />
        <span className="hidden sm:inline">View Sprint</span>
      </Button>
    );

    // Render boards
    return boardsWithTeamLeads.map((board) => (
      <TableRow
        key={board.id}
        className={`grid grid-cols-1 md:table-row transition-all duration-200 ${
          board.projects?.isUserInvolved 
            ? "bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-950/50 dark:via-gray-900 dark:to-purple-950/50 hover:from-blue-100 hover:via-blue-50 hover:to-purple-100 dark:hover:from-blue-900/70 dark:hover:via-gray-800 dark:hover:to-purple-900/70 border-l-4 border-blue-500 shadow-sm" 
            : "bg-gray-50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-l-4 border-gray-300 dark:border-gray-600"
        }`}
      >
        {board.projects?.kanban_display && (
          <>
            {/* Board Name */}
            <TableCell className="md:table-cell">
              <div className="flex flex-col">
                <span className={`font-medium ${
                  board.projects?.isUserInvolved 
                    ? "text-gray-900 dark:text-white" 
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                  {board.name}
                </span>
                {board.description && (
                  <span className={`text-sm ${
                    board.projects?.isUserInvolved 
                      ? "text-gray-600 dark:text-gray-300" 
                      : "text-gray-400 dark:text-gray-500"
                  }`}>
                    {board.description}
                  </span>
                )}
              </div>
            </TableCell>

            {/* Project Name */}
            <TableCell className="md:table-cell">
              <span className={
                board.projects?.isUserInvolved 
                  ? "text-gray-800 dark:text-gray-200" 
                  : "text-gray-500 dark:text-gray-400"
              }>
                {board.projects?.name || "No project assigned"}
              </span>
            </TableCell>

            {/* Team Lead */}
            <TableCell className="md:table-cell">
              {board.projects?.codev ? (
                <div className="flex items-center gap-2">
                  {board.projects.codev.image_url && (
                    <img
                      src={board.projects.codev.image_url}
                      alt={`${board.projects.codev.first_name}'s avatar`}
                      className={`h-8 w-8 rounded-full object-cover ${
                        board.projects?.isUserInvolved ? "" : "opacity-50 grayscale"
                      }`}
                    />
                  )}
                  <span className={`capitalize ${
                    board.projects?.isUserInvolved 
                      ? "text-gray-800 dark:text-gray-200" 
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {`${board.projects.codev.first_name} ${board.projects.codev.last_name}`}
                  </span>
                </div>
              ) : (
                <span className={
                  board.projects?.isUserInvolved 
                    ? "text-gray-600 dark:text-gray-300" 
                    : "text-gray-500 dark:text-gray-400"
                }>
                  No team lead assigned
                </span>
              )}
            </TableCell>

            {/* Actions */}
            <TableCell className="text-center md:table-cell">
              {board.projects?.isUserInvolved ? (
                <Link href={`${pathsConfig.app.kanban}/${board.projects.id}`}>
                  <Button
                    variant="hollow"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm"
                  >
                    <IconKanban className="h-4 w-4 text-white" />
                    <span className="hidden sm:inline">View Sprint</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="hollow"
                  disabled
                  className="inline-flex items-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                >
                  <IconKanban className="h-4 w-4" />
                  <span className="hidden sm:inline">No Access</span>
                </Button>
              )}
            </TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  // Render the full page
  return (
    <AsyncErrorBoundary
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-4xl">📋</div>
          <h2 className="mb-2 text-xl font-semibold">Unable to load Kanban boards</h2>
          <p className="text-gray-600 dark:text-gray-400">
            There was an issue loading your Kanban boards. Please try refreshing the page.
          </p>
        </div>
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <IconKanban className="h-5 w-5 text-white transform translate-x-0.5" />
            </div>
            <div>
              <H1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                📋 Kanban Projects
              </H1>
              <p className="text-gray-600 dark:text-gray-400">Manage your project boards and sprints</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
            <div className="relative">
              <KanbanBoardsSearch
                className="h-10 w-full rounded-full border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm md:w-80"
                placeholder="🔍 Search boards..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-0">
                <TableHead className="w-[30%] font-semibold text-gray-900 dark:text-white">
                  📋 Board Name
                </TableHead>
                <TableHead className="w-[30%] font-semibold text-gray-900 dark:text-white">
                  🚀 Project
                </TableHead>
                <TableHead className="w-[30%] font-semibold text-gray-900 dark:text-white">
                  👑 Team Lead
                </TableHead>
                <TableHead className="w-[10%] text-center font-semibold text-gray-900 dark:text-white">
                  ⚡ Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white dark:bg-gray-950">
              {renderTableContent()}
            </TableBody>
          </Table>
        </div>
      </div>
    </AsyncErrorBoundary>
  );
}

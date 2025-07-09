// page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Box } from "@/Components/shared/dashboard";
import H1 from "@/Components/shared/dashboard/H1";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
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
        className={`grid grid-cols-1 md:table-row ${board.projects?.isUserInvolved ? "text-light-900 bg-gradient-to-r from-purple-200 via-blue-50 to-sky-300 dark:from-purple-800 dark:via-blue-300 dark:to-sky-950" : "pointer-events-none cursor-not-allowed select-none opacity-30"}`}
      >
        {board.projects?.kanban_display && (
          <>
            {/* Board Name */}
            <TableCell className="md:table-cell">
              <div className="flex flex-col">
                <span className="text-dark100_light900 font-medium text-white">
                  {board.name}
                </span>
                {board.description && (
                  <span className="text-dark100_light900 text-sm text-white">
                    {board.description}
                  </span>
                )}
              </div>
            </TableCell>

            {/* Project Name */}
            <TableCell className="md:table-cell">
              <span className="text-dark100_light900">
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
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-dark100_light900 capitalize">
                    {`${board.projects.codev.first_name} ${board.projects.codev.last_name}`}
                  </span>
                </div>
              ) : (
                "No team lead assigned"
              )}
            </TableCell>

            {/* Actions */}
            <TableCell className="text-center md:table-cell">
              {board.projects?.isUserInvolved ? (
                <Link href={`${pathsConfig.app.kanban}/${board.projects.id}`}>
                  {view_sprint}
                </Link>
              ) : (
                <>{view_sprint}</>
              )}
            </TableCell>
          </>
        )}
      </TableRow>
    ));
  };

  // Render the full page
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <H1>Kanban Projects</H1>
        <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
          <KanbanBoardsSearch
            className="h-10 w-full rounded-full border border-gray-200 bg-transparent px-5 text-sm focus:outline-none dark:border-gray-700 md:w-80"
            placeholder="Search boards..."
          />
        </div>
      </div>

      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead className="w-[30%]">Board Name</TableHead>
            <TableHead className="w-[30%]">Project</TableHead>
            <TableHead className="w-[30%]">Team Lead</TableHead>
            <TableHead className="w-[10%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>{renderTableContent()}</TableBody>
      </Table>
    </div>
  );
}

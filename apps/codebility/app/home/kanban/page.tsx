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
import PageContainer from "../_components/PageContainer";

import KanbanBoardsSearch from "./_components/KanbanBoardsSearch";

// Kanban boards update frequently, use 30 second revalidation
export const revalidate = 30;
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
  codev?: CodevData | null;
  role?: string;
}

interface ProjectData {
  id: string;
  name: string;
  client_id?: string;
  team_leader?: CodevData | null;
  kanban_display: boolean;
  project_members: ProjectMemberData[];
  isUserInvolved?: boolean;
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

  let projectQuery = supabase.from("projects").select(
    `
      id,
      name,
      description,
      kanban_display,
      project_members!inner (
        role,
        codev:codev_id (
          id,
          first_name,
          last_name,
          image_url
        )
      )
    `,
  );

  if (searchParams.query) {
    projectQuery = projectQuery.ilike("name", `%${searchParams.query}%`);
  }

  const { data: projects, error } = await projectQuery;
  const typedProjects = projects as unknown as ProjectData[];

  // Extended type for the new array
  const projectsWithTeamLead: ProjectData[] = typedProjects?.map((project) => {
    const teamLeader = project.project_members.find(
      (member) => member.role === "team_leader",
    );

    return {
      ...project,

      team_leader: teamLeader ? teamLeader.codev : null,
      isUserInvolved: project.project_members.some(
        (member) => member.codev?.id === currentUserId,
      ),
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
    if (!typedProjects) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`loading-${index}`} className="grid grid-cols-1 md:table-row">
          {/* Project Name Column */}
          <TableCell className="md:table-cell">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-24 md:w-32" />
            </div>
          </TableCell>
          
          {/* Team Lead Column */}
          <TableCell className="md:table-cell">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-28 md:w-36" />
            </div>
          </TableCell>
          
          {/* Actions Column */}
          <TableCell className="text-center md:table-cell">
            <div className="flex justify-center">
              <Skeleton className="h-9 w-24 md:w-28 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ));
    }

    // Empty state
    if (!typedProjects || typedProjects.length === 0) {
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

    // Render boards
    return projectsWithTeamLead.map((project) => (
      <TableRow
        key={project.id}
        className={`grid grid-cols-1 transition-all duration-200 md:table-row ${
          project.isUserInvolved
            ? "from-customBlue-50 dark:from-customBlue-950/50 hover:from-customBlue-100 hover:via-customBlue-50 dark:hover:from-customBlue-900/70 border-customBlue-500 border-l-4 bg-gradient-to-r via-white to-purple-50 shadow-sm hover:to-purple-100 dark:via-gray-900 dark:to-purple-950/50 dark:hover:via-gray-800 dark:hover:to-purple-900/70"
            : "border-l-4 border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-600 dark:bg-gray-800/30 dark:text-gray-400"
        }`}
      >
        {project.kanban_display && (
          <>
            {/* Project Name */}
            <TableCell className="md:table-cell">
              <span
                className={
                  project.isUserInvolved
                    ? "text-gray-800 dark:text-gray-200"
                    : "text-gray-500 dark:text-gray-400"
                }
              >
                {project.name || "No project assigned"}
              </span>
            </TableCell>

            {/* Team Lead */}
            <TableCell className="md:table-cell">
              {project.team_leader ? (
                <div className="flex items-center gap-2">
                  {project.team_leader.image_url && (
                    <img
                      src={project.team_leader.image_url}
                      alt={`${project.team_leader.first_name}'s avatar`}
                      className={`h-8 w-8 rounded-full object-cover ${
                        project.isUserInvolved ? "" : "opacity-50 grayscale"
                      }`}
                    />
                  )}
                  <span
                    className={`capitalize ${
                      project.isUserInvolved
                        ? "text-gray-800 dark:text-gray-200"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {`${project.team_leader.first_name} ${project.team_leader.last_name}`}
                  </span>
                </div>
              ) : (
                <span
                  className={
                    project.isUserInvolved
                      ? "text-gray-600 dark:text-gray-300"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  No team lead assigned
                </span>
              )}
            </TableCell>

            {/* Actions */}
            <TableCell className="text-center md:table-cell">
              {project.isUserInvolved ? (
                <Link href={`${pathsConfig.app.kanban}/${project.id}`}>
                  <Button
                    variant="hollow"
                    className="bg-customBlue-600 hover:bg-customBlue-700 dark:bg-customBlue-600 dark:hover:bg-customBlue-700 inline-flex items-center gap-2 text-white shadow-sm"
                  >
                    <IconKanban className="h-4 w-4 text-white" />
                    <span className="hidden sm:inline">View Sprint</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="hollow"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
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
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <AsyncErrorBoundary
          fallback={
            <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 text-4xl">📋</div>
              <h2 className="mb-2 text-xl font-semibold">
                Unable to load Kanban boards
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                There was an issue loading your Kanban boards. Please try refreshing
                the page.
              </p>
            </div>
          }
        >
          <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="from-customBlue-500 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br to-purple-500 shadow-lg">
              <IconKanban className="h-5 w-5 translate-x-0.5 transform text-white" />
            </div>
            <div>
              <H1 className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                📋 Kanban Projects
              </H1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your project boards and sprints
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
            <div className="relative">
              <KanbanBoardsSearch
                className="focus:ring-customBlue-500 h-10 w-full rounded-full border border-gray-200 bg-white px-5 text-sm shadow-sm focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-600 dark:bg-gray-800 md:w-80"
                placeholder="🔍 Search boards..."
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
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
      </div>
    </div>
  );
}

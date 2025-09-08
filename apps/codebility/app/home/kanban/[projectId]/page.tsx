import Link from "next/link";
import { redirect } from "next/navigation";
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
import { ArrowRightIcon, IconKanban } from "@/public/assets/svgs";
import { KanbanBoardType, KanbanSprintType } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { format } from "date-fns";

import { TableActions } from "../_components/TableActions";
import AddSprintButton from "./_components/AddSprintButton";

// Types
export interface KanbanSprintData extends KanbanSprintType {
  kanban_board: KanbanBoardType | null;
}

interface KanbanProjectWithSprintsData {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  kanban_sprints: KanbanSprintData[] | KanbanSprintData | null;
}

interface PageProps {
  params: Promise<{ projectId: string }>;
}

/**
 * Maps raw sprint data to typed sprint structure
 * Ensures type safety and handles null values gracefully
 */
const mapSprint = (sprint: any): KanbanSprintData => {
  return {
    id: String(sprint.id),
    board_id: String(sprint.board_id || ""),
    project_id: String(sprint.project_id || ""),
    name: sprint.name || "Unnamed Sprint",
    start_at: sprint.start_at || null,
    end_at: sprint.end_at || null,
    created_at: sprint.created_at,
    updated_at: sprint.updated_at,
    kanban_board: sprint.kanban_board || null,
  };
};

/**
 * Formats date range for display in timeline column
 * Handles edge cases and provides fallback text
 */
function formatDateRange(
  startDate: string | null,
  endDate: string | null,
): string {
  if (!startDate || !endDate) {
    return "No timeline";
  }
  try {
    return `${format(new Date(startDate), "MMM dd, yyyy")} - ${format(new Date(endDate), "MMM dd, yyyy")}`;
  } catch {
    return "Invalid timeline";
  }
}

/**
 * Enhanced Kanban Sprint Page with two-level breadcrumb navigation
 * Shows project sprints with timeline and board access
 * Follows KISS, YAGNI, DRY, and SOLID principles
 */
export default async function KanbanSprintPage(props: PageProps) {
  const params = await props.params;
  const supabase = await createClientServerComponent();

  // Early validation for required parameters
  if (!params?.projectId) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
        <H1>Error: Invalid Project ID</H1>
        <p>Please ensure you are accessing a valid project URL.</p>
      </div>
    );
  }

  // Authentication and authorization checks
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  if (!sessionUser) {
    redirect("/auth/sign-in");
  }

  // Verify user is member of the project
  const { data: member, error } = await supabase
    .from("project_members")
    .select("id")
    .eq("codev_id", sessionUser?.id)
    .eq("project_id", params?.projectId)
    .single();

  const userIsPartOfProject = !!member;

  if (!userIsPartOfProject) {
    redirect("/home/kanban");
  }

  try {
    // Fetch project data with nested sprints and boards
    let projectWithSprintsQuery = supabase
      .from("projects")
      .select(
        `
        id,
        name,
        kanban_sprints!kanban_sprints_project_id_fkey (
          id,
          name,
          start_at,
          end_at,
          project_id,
          board_id,
          kanban_board:kanban_boards!kanban_sprints_board_id_fkey (
            id,
            name
          )
        )
      `,
      )
      .eq("id", params.projectId)
      .single();

    const { data, error } = await projectWithSprintsQuery;
    const project = data as KanbanProjectWithSprintsData | null;

    /**
     * Renders table content based on data state
     * Handles loading, error, and empty states appropriately
     */
    const renderTableContent = () => {
      // Error handling
      if (error) {
        return (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-red-500">
              {error.message || "Error loading sprints"}
            </TableCell>
          </TableRow>
        );
      }

      // Loading state
      if (!project) {
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
      if (!project.kanban_sprints) {
        return (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-dark100_light900 py-8 text-center"
            >
              No sprints available. Create a sprint to get started.
            </TableCell>
          </TableRow>
        );
      }

      // Normalize kanban_sprints to an array
      const sprints: KanbanSprintData[] = project.kanban_sprints
        ? Array.isArray(project.kanban_sprints)
          ? project.kanban_sprints.map(mapSprint)
          : [mapSprint(project.kanban_sprints)]
        : [];

      // Render sprints
      if (sprints.length === 0) {
        return (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-dark100_light900 py-8 text-center"
            >
              No sprints available. Create a sprint to get started.
            </TableCell>
          </TableRow>
        );
      }

      return sprints.map((sprint) => (
        <TableRow
          key={sprint.id}
          className="border-customBlue-500 grid grid-cols-1 border-l-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 md:table-row"
        >
          <TableCell className="md:table-cell">
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white">
                {sprint.name}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-700 dark:text-gray-300">
                {sprint.kanban_board?.name}
              </span>
            </div>
          </TableCell>
          <TableCell className="md:table-cell">
            <span className="text-gray-700 dark:text-gray-300">
              {formatDateRange(sprint.start_at, sprint.end_at)}
            </span>
          </TableCell>
          <TableCell className="text-center md:table-cell">
            <div className="flex items-center justify-center gap-2">
              <Link
                href={`${pathsConfig.app.kanban}/${params.projectId}/${sprint.kanban_board?.id}`}
              >
                <Button
                  variant="hollow"
                  className="bg-customBlue-600 hover:bg-customBlue-700 dark:bg-customBlue-600 dark:hover:bg-customBlue-700 inline-flex items-center gap-2 text-white shadow-sm"
                >
                  <IconKanban className="h-4 w-4 text-white" />
                  <span className="hidden sm:inline">View Board</span>
                </Button>
              </Link>
              <TableActions sprint={sprint} />
            </div>
          </TableCell>
        </TableRow>
      ));
    };

    // Main page render
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
        {/* Two-Level Breadcrumb Navigation */}
        <nav
          className="flex flex-row items-center gap-3 pb-2 text-sm"
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

          {/* Level 2: Current Project Name */}
          <span
            className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text font-semibold text-gray-900 text-transparent dark:text-white"
            aria-current="page"
          >
            {project?.name || "Loading..."}
          </span>
        </nav>

        {/* Page Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <H1>Kanban Sprints - {project?.name || "Loading..."}</H1>
          <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
            <AddSprintButton projectId={params.projectId} />
          </div>
        </header>

        {/* Sprints Table */}
        <main className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <TableHead className="w-[45%] font-semibold text-gray-900 dark:text-white">
                  🏃‍♂️ Sprint
                </TableHead>
                <TableHead className="w-[45%] font-semibold text-gray-900 dark:text-white">
                  📅 Timeline
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
        </main>
      </div>
    );
  } catch (err) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
        <H1>Error Loading Kanban Sprints</H1>
        <p>An unexpected error occurred. Please try again later.</p>
      </div>
    );
  }
}

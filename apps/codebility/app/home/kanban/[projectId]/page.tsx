import Link from "next/link";
import { redirect } from "next/navigation";
import H1 from "@/components/shared/dashboard/H1";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireProjectMember } from "@/lib/server/auth-guard";
import pathsConfig from "@/types/zod/paths.config";
import { ArrowRightIcon, IconKanban } from "@/public/assets/svgs";
import { format } from "date-fns";

import { getSprintsData } from "@/actions/kanban/sprints";
import PageContainer from "../../_components/PageContainer";

import { TableActions } from "../_components/TableActions";
import {
  KanbanProjectWithSprintsData,
  KanbanSprintData,
} from "../_types/sprint";
import AddSprintButton from "./_components/AddSprintButton";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

/**
 * Maps raw sprint data to typed sprint structure
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
 * Formats date range for display
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

export default async function KanbanSprintPage({ params }: PageProps) {
  const { projectId } = await params;

  try {
    await requireProjectMember(projectId);
  } catch (err) {
    redirect(
      err instanceof Error && err.message === "Unauthorized"
        ? "/auth/sign-in"
        : pathsConfig.app.kanban,
    );
  }

  let project: KanbanProjectWithSprintsData | null = null;
  let error: string | null = null;

  try {
    project = (await getSprintsData(
      projectId,
    )) as unknown as KanbanProjectWithSprintsData;
  } catch (err) {
    error = err instanceof Error ? err.message : "Unexpected error";
  }

  const sprints: KanbanSprintData[] = !project?.kanban_sprints
    ? []
    : Array.isArray(project.kanban_sprints)
      ? project.kanban_sprints.map(mapSprint)
      : [mapSprint(project.kanban_sprints)];

  /**
   * Render table content
   */
  const renderTableContent = () => {
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-red-500">
            {error}
          </TableCell>
        </TableRow>
      );
    }

    if (sprints.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="py-8 text-center text-gray-500">
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
        <TableCell>
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
        <TableCell>
          <span className="text-gray-700 dark:text-gray-300">
            {formatDateRange(sprint.start_at, sprint.end_at)}
          </span>
        </TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`${pathsConfig.app.kanban}/${projectId}/${sprint.kanban_board?.id}`}
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

  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        {/* Breadcrumb */}
        <nav className="flex flex-row items-center gap-3 pb-2 text-sm">
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
          <span className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text font-semibold text-gray-900 text-transparent dark:text-white">
            {project?.name || "Error"}
          </span>
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <H1>Kanban Sprints - {project?.name}</H1>
          <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
            <AddSprintButton projectId={projectId} />
          </div>
        </header>

        {/* Table */}
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
    </PageContainer>
  );
}

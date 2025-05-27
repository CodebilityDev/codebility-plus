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
import Link from "next/link";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { KanbanBoardType, KanbanSprintType } from "@/types/home/codev";
import { format } from "date-fns";
import AddSprintButton from "./_components/AddSprintButton";

// Types
interface Params {
  projectId: string;
}

interface SearchParams {
  query?: string;
}

interface KanbanSprintData extends KanbanSprintType {
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
  params: Params;
}

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

function formatDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate || !endDate) {
    return "No timeline";
  }
  try {
    return `${format(new Date(startDate), "MMM dd, yyyy")} - ${format(new Date(endDate), "MMM dd, yyyy")}`;
  } catch {
    return "Invalid timeline";
  }
}

export default async function KanbanSprintPage({
  params,
}: PageProps) {
  const supabase = getSupabaseServerComponentClient();

  if (!params?.projectId) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
        <H1>Error: Invalid Project ID</H1>
        <p>Please ensure you are accessing a valid project URL.</p>
      </div>
    );
  }

  try {
    // Construct the sprint query
    let projectWithSprintsQuery = supabase
      .from("projects")
      .select(`
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
      `)
      .eq("id", params.projectId)
      .single();


    // Execute the query
    const { data, error } = await projectWithSprintsQuery;
    const project = data as KanbanProjectWithSprintsData | null;

    // Render table content
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
        <TableRow key={sprint.id} className="grid grid-cols-1 md:table-row">
          <TableCell className="md:table-cell">
            <div className="text-dark100_light900 flex flex-col">
              <span className="font-medium">{sprint.name}</span>
            </div>
          </TableCell>
          <TableCell className="md:table-cell">
            <span className="text-dark100_light900">
              {formatDateRange(sprint.start_at, sprint.end_at)}
            </span>
          </TableCell>
          <TableCell className="text-center md:table-cell">
            <Link
              href={`${pathsConfig.app.kanban}/${params.projectId}/${sprint.kanban_board?.id}`}
            >
              <Button
                variant="hollow"
                className="inline-flex items-center gap-2"
              >
                <IconKanban className="invert-colors h-4 w-4" />
                <span className="hidden sm:inline">View Board</span>
              </Button>
            </Link>
          </TableCell>
        </TableRow>
      ));
    };

    // Render the full page
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <H1>Kanban Sprints - {project?.name || "Loading..."}</H1>
          <div className="flex flex-col items-end gap-4 md:flex-row md:items-center">
            <AddSprintButton projectId={params.projectId} />
          </div>
        </div>

        <Table>
          <TableHeader className="hidden md:table-header-group">
            <TableRow>
              <TableHead className="w-[45%]">Sprint</TableHead>
              <TableHead className="w-[45%]">Timeline</TableHead>
              <TableHead className="w-[10%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>{renderTableContent()}</TableBody>
        </Table>
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

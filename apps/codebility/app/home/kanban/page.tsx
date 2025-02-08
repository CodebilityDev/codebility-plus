// page.tsx
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

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import KanbanBoardsSearch from "./_components/kanban-boards-search";

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

interface ProjectData {
  id: string;
  name: string;
  team_leader_id: string;
  codev?: CodevData;
}

interface KanbanBoardData {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  projects?: ProjectData | null;
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function KanbanPage({ searchParams }: PageProps) {
  const supabase = getSupabaseServerComponentClient();

  let boardQuery = supabase.from("kanban_boards").select(`
    id,
    name,
    description,
    created_at,
    updated_at,
    projects!kanban_boards_project_id_fkey (
      id,
      name,
      codev!projects_team_leader_id_fkey (
        id,
        first_name,
        last_name,
        image_url
      )
    )
  `);

  if (searchParams.query) {
    boardQuery = boardQuery.ilike("name", `%${searchParams.query}%`);
  }

  const { data: boards, error } = await boardQuery;
  const typedBoards = boards as KanbanBoardData[] | null;

  const renderTableContent = () => {
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-red-500">
            {error.message || "Error loading boards"}
          </TableCell>
        </TableRow>
      );
    }

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

    if (typedBoards.length === 0) {
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

    return typedBoards.map((board) => (
      <TableRow key={board.id} className="grid grid-cols-1 md:table-row">
        <TableCell className="md:table-cell">
          <div className="text-dark100_light900 flex flex-col">
            <span className="font-medium">{board.name}</span>
            {board.description && (
              <span className="text-sm">{board.description}</span>
            )}
          </div>
        </TableCell>

        <TableCell className="md:table-cell">
          <span className="text-dark100_light900">
            {board.projects?.name || "No project assigned"}
          </span>
        </TableCell>

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

        <TableCell className="text-center md:table-cell">
          <Link href={`${pathsConfig.app.kanban}/${board.id}`}>
            <Button variant="hollow" className="inline-flex items-center gap-2">
              <IconKanban className="h-4 w-4" />
              <span className="hidden sm:inline">View Board</span>
            </Button>
          </Link>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <H1>Kanban Boards</H1>
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

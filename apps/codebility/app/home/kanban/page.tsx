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

export default async function KanbanPage({
  searchParams,
}: {
  searchParams: {
    query: string;
  };
}) {
  const query = searchParams.query;
  const supabase = getSupabaseServerComponentClient();

  let supabaseBoardQuery = supabase.from("board").select(`*,
    project(
      *,
      codev(
        user(
          profile(
            first_name,
            last_name
          )
        )
      )
    )
  `);

  if (query) {
    // apply board filter if there is query in url search query.
    supabaseBoardQuery = supabaseBoardQuery.like("name", `%${query}%`);
  }

  const { data, error } = await supabaseBoardQuery;

  return (
    <div className="text-dark100_light900 mx-auto flex max-w-7xl flex-col gap-4 ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <H1>Codevs Board</H1>
        <div className="flex flex-col items-end gap-4 md:flex-row md:items-center md:justify-end">
          <KanbanBoardsSearch
            className="border-gray h-10 w-full rounded-full border border-opacity-50 bg-inherit px-5 text-xs focus:outline-none md:w-80"
            placeholder="Search Board"
          />
        </div>
      </div>
      <Table>
        <TableHeader className="hidden xl:block">
          <TableRow className="text-dark100_light900 grid grid-cols-4 place-items-center border-none">
            <TableHead>Name</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Lead</TableHead>
            <TableHead>Board</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-1">
          {!error ? (
            <>
              {data?.map((board) => (
                <TableRow
                  key={board.id}
                  className="background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500 flex flex-col xl:grid xl:flex-none xl:grid-cols-4 xl:place-items-center"
                >
                  <TableCell>
                    <p>{board.name}</p>
                  </TableCell>
                  <TableCell>
                    <p>{board.project.name}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-x-1">
                      <p className="capitalize">
                        {board.project?.codev.user.profile.first_name}
                      </p>
                      <p className="capitalize">
                        {board.project?.codev.user.profile.last_name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="xl:flex xl:items-center xl:justify-center">
                    <Link href={`${pathsConfig.app.kanban}/${board.id}`}>
                      <Button variant="hollow" className="border-none xl:w-max">
                        <IconKanban className="invert dark:invert-0" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <>
              <TableRow className="background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500 flex flex-col">
                <TableCell>
                  <Box className="flex-1">
                    <div className="mx-auto flex flex-col items-center gap-3">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow className="background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500 flex flex-col">
                <TableCell>
                  <Box className="flex-1">
                    <div className="mx-auto flex flex-col items-center gap-3">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow className="background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500 flex flex-col">
                <TableCell>
                  <Box className="flex-1">
                    <div className="mx-auto flex flex-col items-center gap-3">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </Box>
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

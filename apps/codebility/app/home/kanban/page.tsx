import H1 from "@/Components/shared/dashboard/H1"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { Box } from "@/Components/shared/dashboard";
import pathsConfig from "@/config/paths.config";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { IconKanban } from "@/public/assets/svgs";
import KanbanBoardsSearch from "./_components/kanban-boards-search";
import BoardAddModal from "./_components/kanban-board-add-modal";

export default async function KanbanPage({ searchParams }: {
  searchParams: {
    query: string;
  }
}) {  
  const query = searchParams.query;
  const supabase = getSupabaseServerComponentClient();

  let supabaseBoardQuery = supabase.from("board")
  .select(`
    *,
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
  `)
  
  if (query) {
    // apply board filter if there is query in url search query.
    supabaseBoardQuery = supabaseBoardQuery.like("name", `%${query}%`);
    console.log(query);
  }

  const { data, error } = await supabaseBoardQuery;

  return (
    <div className="text-dark100_light900 mx-auto flex max-w-7xl flex-col gap-4 ">
      <div className="flex flex-row justify-between gap-4">
        <H1>Codevs Board</H1>
      </div>
      <div className="text-dark100_light900 flex max-w-7xl flex-col gap-4">
        <div className="text-dark100_light900 text-md font-semibold md:text-2xl">BOARDS</div>
        <div className="flex flex-col items-end gap-4 md:flex-row md:items-center md:justify-end">
          <KanbanBoardsSearch />
          <BoardAddModal />
        </div>
        <Table>
            <TableHeader className="hidden lg:block">
              <TableRow className="grid grid-cols-4 place-items-center text-dark100_light900 border-none">
                  <TableHead>Name</TableHead>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Board</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1">
              {
                !error ?
                    <>
                      {data?.map((board) => (
                        <TableRow
                        key={board.id}
                        className="flex flex-col lg:flex-none lg:grid lg:grid-cols-4 lg:place-items-center background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500"
                        >
                          <TableCell>
                              <p>{board.name}</p>
                          </TableCell>

                          <TableCell>
                              <p>{board.project.name}</p>
                          </TableCell>

                          <TableCell>
                            <p>
                                {board.project?.codev.user.profile.first_name} {board.project?.codev.user.profile.last_name} 
                            </p>
                          </TableCell>

                          <TableCell className="lg:flex lg:justify-center lg:items-center">
                              <Link href={`${pathsConfig.app.kanban}/${board.id}`}>
                              <Button variant="hollow" className="border-none lg:w-max">
                                  <IconKanban className="invert dark:invert-0" />
                              </Button>
                              </Link>
                          </TableCell>
                        </TableRow>
                    ))}
                  </>
                  :
                  <>
                    <TableRow
                      className="flex flex-col background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500"
                    >
                      <TableCell>
                        <Box className="flex-1">
                          <div className="mx-auto flex flex-col items-center gap-3">
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      className="flex flex-col background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500"
                    >
                      <TableCell>
                        <Box className="flex-1">
                          <div className="mx-auto flex flex-col items-center gap-3">
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      className="flex flex-col background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500"
                    >
                      <TableCell>
                        <Box className="flex-1">
                          <div className="mx-auto flex flex-col items-center gap-3">
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </>
              }
            </TableBody> 
        </Table>
      </div>
    </div>
  )
}

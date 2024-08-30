import H1 from "@/Components/shared/dashboard/H1"
import KanbanBoardsContainer from "./_components/kanban-boards-container"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { Box } from "@/Components/shared/dashboard";

export default async function KanbanPage() {  
  const supabase = await getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("board")
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
  `);

  return (
    <div className="text-dark100_light900 mx-auto flex max-w-7xl flex-col gap-4 ">
      <div className="flex flex-row justify-between gap-4">
        <H1>Codevs Board</H1>
      </div>
      <div className="text-dark100_light900 flex max-w-7xl flex-col gap-4">
        <div className="text-dark100_light900 text-md font-semibold md:text-2xl">BOARDS</div>
     {/*    <KanbanBoardsContainer /> */}
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
                !true ?
                  <div></div>
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

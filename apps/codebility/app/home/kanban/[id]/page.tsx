import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import KanbanBoard from "./_components/kanban-board"
import { List } from "./_types/board";

export default async function KanbanPage({ params, searchParams }: 
  { 
    params: { id: string },
    searchParams: { query: string }  
  }) {
  const supabase = getSupabaseServerComponentClient();

  const { data: board, error } = await supabase.from("board")
  .select(`
    *,
    list(
      *,
      task(
        *,
        codev_task(
          codev(
            *,
            user(
              *,
              profile(*)
            )
          )
        ) 
      )
    )  
  `)
  .eq("id", params.id)
  .single();

  if (error) return <div>ERROR</div>;
  
  const listQuery = searchParams.query;

  if (listQuery) // filter out board lists by the search input value.
    board.list = board.list.filter((l: List) => l.name.indexOf(listQuery) >= 0);

  return <KanbanBoard boardData={board}/>
}

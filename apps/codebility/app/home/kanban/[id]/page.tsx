import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import KanbanBoard from "./_components/kanban-board"

export default async function KanbanPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerComponentClient();

  const { data: board, error } = await supabase.from("board")
  .select(`
    *,
    list(
      *,
      task(*)
    )  
  `)
  .eq("id", params.id)
  .single();

  return <KanbanBoard boardData={board}/>
}

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import KanbanBoard from "./_components/kanban-board";

export default async function KanbanPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { query: string };
}) {
  const supabase = getSupabaseServerComponentClient();

  const { data: board, error } = await supabase
    .from("board")
    .select(
      `
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
  `,
    )
    .eq("id", params.id)
    .single();

  if (error) return <div>ERROR</div>;

  const listQuery = searchParams.query;

  if (listQuery && board?.list) {
    board.list = board.list.filter((list: { name: string }) =>
      list.name.toLowerCase().includes(listQuery.toLowerCase()),
    );
  }

  return <KanbanBoard boardData={board} />;
}

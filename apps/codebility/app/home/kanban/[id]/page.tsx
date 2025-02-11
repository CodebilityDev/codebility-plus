import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import KanbanBoard from "./_components/KanbanBoard";

export default async function KanbanBoardPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { query?: string };
}) {
  const supabase = getSupabaseServerComponentClient();

  // Updated query to join both the primary assignee and skill category details.
  const { data: board, error } = await supabase
    .from("kanban_boards")
    .select(
      `
      id,
      name,
      description,
      created_at,
      updated_at,
      kanban_columns (
        id,
        name,
        position,
        created_at,
        updated_at,
        tasks (
          id,
          title,
          description,
          priority,
          difficulty,
          type,
          due_date,
          points,
          pr_link,
          sidekick_ids,
          kanban_column_id,
          codev!tasks_codev_id_fkey (
            id,
            first_name,
            last_name,
            image_url
          ),
          skill_category!tasks_skill_category_id_fkey (
            id,
            name
          )
        )
      )
    `,
    )
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("Error fetching board:", error);
    return <div>Error loading board: {error.message}</div>;
  }

  if (!board) {
    return <div>Board not found</div>;
  }

  // Filter columns by search query if provided
  let filteredColumns = board.kanban_columns;
  if (searchParams.query) {
    filteredColumns = board.kanban_columns.filter((column: { name: string }) =>
      column.name
        .toLowerCase()
        .includes(searchParams.query?.toLowerCase() || ""),
    );
  }

  const boardData = {
    ...board,
    kanban_columns: filteredColumns || [],
  };

  return <KanbanBoard boardData={boardData} />;
}

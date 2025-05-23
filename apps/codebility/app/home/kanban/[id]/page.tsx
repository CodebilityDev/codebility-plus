import { KanbanBoardType, KanbanColumnType, Task } from "@/types/home/codev";



import KanbanBoard from "./_components/KanbanBoard";
import { createClientServerComponent } from "@/utils/supabase/server";

interface KanbanBoardPageProps {
  params: { id: string };
  searchParams: { query?: string };
}

// Mapping functions to convert raw data into our expected types.
const mapTask = (task: any): Task => ({
  id: String(task.id),
  title: task.title,
  description: task.description,
  priority: task.priority,
  difficulty: task.difficulty,
  type: task.type,
  due_date: task.due_date,
  kanban_column_id: task.kanban_column_id,
  codev_id: task.codev_id,
  created_by: task.created_by,
  sidekick_ids: task.sidekick_ids,
  points: task.points,
  is_archive: task.is_archive,
  pr_link: task.pr_link,
  created_at: task.created_at,
  updated_at: task.updated_at,
  skill_category_id: task.skill_category_id,
  // Optionally, if you need to map codev and skill_category further, you can do so.
  codev: task.codev,
  skill_category: task.skill_category,
});

const mapColumn = (column: any): KanbanColumnType => ({
  id: String(column.id),
  board_id: column.board_id,
  name: column.name,
  position: column.position,
  created_at: column.created_at,
  updated_at: column.updated_at,
  tasks: Array.isArray(column.tasks) ? column.tasks.map(mapTask) : [],
});

export default async function KanbanBoardPage({
  params,
  searchParams,
}: KanbanBoardPageProps) {
  const supabase = await createClientServerComponent();
  // Query the board with nested columns and tasks
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

  // Map the columns using our mapping function
  const mappedColumns: KanbanColumnType[] = Array.isArray(board.kanban_columns)
    ? board.kanban_columns.map(mapColumn)
    : [];

  const query = searchParams.query?.toLowerCase() || "";

  // Apply search filter if a query is provided.
  const filteredColumns = query
    ? mappedColumns.filter((column) =>
        column.name.toLowerCase().includes(query),
      )
    : mappedColumns;

  // Build the typed board data
  const boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] } = {
    id: String(board.id),
    name: board.name,
    description: board.description,
    created_at: board.created_at,
    updated_at: board.updated_at,
    kanban_columns: filteredColumns,
  };

  return <KanbanBoard boardData={boardData} />;
}

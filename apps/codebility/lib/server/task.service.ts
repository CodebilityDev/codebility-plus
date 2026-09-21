import "server-only";

import { createClientServerComponent } from "@/utils/supabase/server";
import { resolvePageArgs, toPage, type Page, type PageArgs } from "@/lib/server/paginate";

// Columns the task card renders. The board/project chain is a nested relation the
// card prints, so it stays, but the task's own columns are explicit.
const TASK_LIST_COLUMNS = `
  id,
  title,
  description,
  priority,
  difficulty,
  type,
  due_date,
  deadline,
  points,
  codev_id,
  kanban_column:kanban_columns (
    id,
    name,
    board:kanban_boards (
      id,
      name,
      project:projects ( id, name )
    )
  ),
  created_by,
  created_at,
  updated_at
`;

export type TaskPageRow = Record<string, any>;

export const getTasksPage = async ({
  codevId,
  page,
  pageSize = 9,
}: PageArgs & { codevId: string }): Promise<Page<TaskPageRow>> => {
  const supabase = await createClientServerComponent();
  const { page: current, pageSize: size, from, to } = resolvePageArgs({ page, pageSize });

  const { data, error, count } = await supabase
    .from("tasks")
    .select(TASK_LIST_COLUMNS, { count: "exact" })
    .eq("codev_id", codevId)
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching tasks page:", error);
    return toPage<TaskPageRow>(null, 0, current, size);
  }

  return toPage((data ?? []) as TaskPageRow[], count, current, size);
};

import type { SupabaseClient } from "@supabase/supabase-js";

import { mapTask } from "@/lib/kanban/board-mappers";
import type { SkillCategory, Task } from "@/types/home/codev";

export type KanbanTaskDetail = {
  task: Task;
  boardId: string | null;
  projectId: string | null;
  primaryAssignee: {
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string | null;
  } | null;
  sidekickDetails: Array<{
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string | null;
  }>;
  createdBy: {
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string | null;
  } | null;
  skillCategory: SkillCategory | null;
};

export async function fetchTaskDetail(
  supabase: SupabaseClient,
  taskId: string,
): Promise<KanbanTaskDetail | null> {
  const { data: task, error } = await supabase
    .from("tasks")
    .select(
      `
        id,
        title,
        description,
        priority,
        difficulty,
        type,
        due_date,
        deadline,
        points,
        position,
        pr_link,
        sidekick_ids,
        created_by,
        kanban_column_id,
        created_at,
        updated_at,
        skill_category_id,
        codev_id,
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
      `,
    )
    .eq("id", taskId)
    .single();

  if (error || !task) {
    console.error("Error fetching task detail:", error);
    return null;
  }

  const [{ data: ticket }, columnResolution, relatedCodevs] = await Promise.all([
    supabase
      .from("task_ticket_codes")
      .select("ticket_code")
      .eq("task_id", taskId)
      .maybeSingle(),
    task.kanban_column_id
      ? supabase
          .from("kanban_columns")
          .select("board_id, kanban_boards(project_id)")
          .eq("id", task.kanban_column_id)
          .single()
      : Promise.resolve({ data: null, error: null }),
    fetchRelatedCodevs(supabase, task),
  ]);

  const boardRow = columnResolution.data as {
    board_id?: string | null;
    kanban_boards?: { project_id?: string | null } | { project_id?: string | null }[] | null;
  } | null;
  const boardId = boardRow?.board_id ?? null;
  const boardMeta = Array.isArray(boardRow?.kanban_boards)
    ? boardRow.kanban_boards[0]
    : boardRow?.kanban_boards;
  const projectId = boardMeta?.project_id ?? null;

  const mappedTask = mapTask({
    ...task,
    ticket_code: ticket?.ticket_code ?? null,
  });

  const assignee = Array.isArray(task.codev) ? task.codev[0] : task.codev;
  const skillCategoryRaw = Array.isArray(task.skill_category)
    ? task.skill_category[0]
    : task.skill_category;

  const primaryAssignee = assignee
    ? {
        id: assignee.id,
        first_name: assignee.first_name,
        last_name: assignee.last_name,
        image_url: assignee.image_url,
      }
    : null;

  const sidekickDetails =
    task.sidekick_ids
      ?.map((id: string) => relatedCodevs.get(id))
      .filter(Boolean) ?? [];

  const createdBy = task.created_by
    ? (relatedCodevs.get(task.created_by) ?? null)
    : null;

  const skillCategory = skillCategoryRaw
    ? (skillCategoryRaw as SkillCategory)
    : null;

  return {
    task: mappedTask,
    boardId,
    projectId,
    primaryAssignee,
    sidekickDetails: sidekickDetails as KanbanTaskDetail["sidekickDetails"],
    createdBy,
    skillCategory,
  };
}

async function fetchRelatedCodevs(
  supabase: SupabaseClient,
  task: {
    created_by?: string | null;
    sidekick_ids?: string[] | null;
  },
) {
  const ids = new Set<string>();
  if (task.created_by) ids.add(task.created_by);
  task.sidekick_ids?.forEach((id) => ids.add(id));

  if (ids.size === 0) {
    return new Map<string, KanbanTaskDetail["createdBy"] & object>();
  }

  const { data, error } = await supabase
    .from("codev")
    .select("id, first_name, last_name, image_url")
    .in("id", [...ids]);

  if (error) {
    console.error("Error fetching related codevs:", error);
    return new Map();
  }

  return new Map(
    (data ?? []).map((member) => [member.id, member]),
  );
}

import type { Database } from "@/types/global/supabase";
import type {
  KanbanBoardSnapshot,
  ProjectListItem,
  SprintListItem,
} from "@/types/home/kanban/kanban";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import {
  BOARD_COLUMNS,
  COLUMN_COLUMNS,
  PROJECT_COLUMNS,
  SPRINT_COLUMNS,
  TASK_COLUMNS,
} from "@/constants/home/kanban/kanban";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";

type KanbanClient = SupabaseClient<Database>;

export async function getCachedProjects(): Promise<ProjectListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.kanbanBoard);

  const { data, error } = await createClientAnon()
    .from("projects")
    .select(PROJECT_COLUMNS)
    .order("name", { ascending: true });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    projectCode: row.project_code,
    startDate: row.start_date,
    endDate: row.end_date,
    kanbanDisplay: row.kanban_display ?? false,
  }));
}

export async function getCachedSprints(
  projectId: string,
): Promise<SprintListItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.kanbanBoard);

  const { data, error } = await createClientAnon()
    .from("kanban_sprints")
    .select(SPRINT_COLUMNS)
    .eq("project_id", projectId)
    .order("start_at", { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    startAt: row.start_at,
    endAt: row.end_at,
    hasBoard: row.board_id !== null,
  }));
}

export async function getBoard(
  sprintId: string,
): Promise<KanbanBoardSnapshot | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.kanbanBoard);

  return loadBoardSnapshot(createClientAnon(), sprintId);
}

export async function loadBoardSnapshot(
  supabase: KanbanClient,
  sprintId: string,
): Promise<KanbanBoardSnapshot | null> {
  const { data: sprint, error: sprintError } = await supabase
    .from("kanban_sprints")
    .select(SPRINT_COLUMNS)
    .eq("id", sprintId)
    .maybeSingle();

  if (sprintError) throw sprintError;
  if (!sprint?.board_id) return null;

  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .select(BOARD_COLUMNS)
    .eq("id", sprint.board_id)
    .maybeSingle();

  if (boardError) throw boardError;
  if (!board) return null;

  const projectId = sprint.project_id ?? board.project_id;
  if (!projectId) return null;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select(PROJECT_COLUMNS)
    .eq("id", projectId)
    .maybeSingle();

  if (projectError) throw projectError;
  if (!project) return null;

  const { data: columns, error: columnsError } = await supabase
    .from("kanban_columns")
    .select(COLUMN_COLUMNS)
    .eq("board_id", board.id)
    .order("position", { ascending: true });

  if (columnsError) throw columnsError;

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .in(
      "kanban_column_id",
      columns.map((column) => column.id),
    )
    .eq("is_archive", false)
    .order("position", { ascending: true });

  if (tasksError) throw tasksError;

  return {
    boardId: board.id,
    boardName: board.name,
    projectId,
    projectName: project.name,
    sprintId: sprint.id,
    sprintName: sprint.name,
    columns: columns.map((column) => ({
      id: column.id,
      name: column.name,
      position: column.position,
    })),
    tasks: tasks.flatMap((task) =>
      task.kanban_column_id
        ? [
            {
              id: task.id,
              title: task.title,
              description: task.description,
              columnId: task.kanban_column_id,
              position: task.position,
              priority: task.priority,
              codevId: task.codev_id,
              dueDate: task.due_date,
              updatedAt: task.updated_at,
            },
          ]
        : [],
    ),
  };
}

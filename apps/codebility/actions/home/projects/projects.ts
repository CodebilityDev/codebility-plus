"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { requireFullAccess } from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { Database } from "@/types/global/supabase";
import type { ProjectFormInput } from "@/types/home/projects/projects";
import { z } from "zod";

type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

const projectFormSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  tagline: z.string().optional(),
  status: z.string().optional(),
  projectCode: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  githubLink: z.string().optional(),
  websiteUrl: z.string().optional(),
  figmaLink: z.string().optional(),
  meetingLink: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  keyFeatures: z.array(z.string()).optional(),
});

const projectIdSchema = z.string().min(1);

const FIELD_MAP = {
  name: "name",
  description: "description",
  tagline: "tagline",
  status: "status",
  projectCode: "project_code",
  startDate: "start_date",
  endDate: "end_date",
  githubLink: "github_link",
  websiteUrl: "website_url",
  figmaLink: "figma_link",
  meetingLink: "meeting_link",
  techStack: "tech_stack",
  keyFeatures: "key_features",
} as const satisfies Record<keyof ProjectFormInput, string>;

function buildProjectRow(input: Partial<ProjectFormInput>): ProjectUpdate {
  const row: Record<string, string | string[] | undefined> = {};

  for (const key of Object.keys(FIELD_MAP) as (keyof ProjectFormInput)[]) {
    const value = input[key];

    if (value === undefined) continue;

    row[FIELD_MAP[key]] = value;
  }

  return row;
}

export async function createProject(
  input: ProjectFormInput,
): Promise<{ projectId: string }> {
  const parsed = projectFormSchema.parse(input);

  await requireFullAccess();

  const supabase = await createClientServerComponent();

  const { data: project, error } = await supabase
    .from("projects")
    .insert({ ...buildProjectRow(parsed), name: parsed.name })
    .select("id")
    .single();

  if (error) throw error;

  updateTag(CACHE_TAGS.projectsList);
  updateTag(CACHE_TAGS.kanbanBoard);

  return { projectId: project.id };
}

export async function updateProject(
  projectId: string,
  input: Partial<ProjectFormInput>,
): Promise<void> {
  const id = projectIdSchema.parse(projectId);
  const parsed = projectFormSchema.partial().parse(input);

  await requireFullAccess();

  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("projects")
    .update({
      ...buildProjectRow(parsed),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;

  updateTag(CACHE_TAGS.projectsList);
  updateTag(CACHE_TAGS.kanbanBoard);
  updateTag(`${CACHE_TAGS.projectDetail}-${id}`);
}

export async function deleteProject(projectId: string): Promise<void> {
  const id = projectIdSchema.parse(projectId);

  await requireFullAccess();

  const supabase = await createClientServerComponent();

  const { data: boards, error: boardsError } = await supabase
    .from("kanban_boards")
    .select("id")
    .eq("project_id", id);

  if (boardsError) throw boardsError;

  let columnIds: string[] = [];

  if (boards.length > 0) {
    const { data: columns, error: columnsError } = await supabase
      .from("kanban_columns")
      .select("id")
      .in(
        "board_id",
        boards.map((board) => board.id),
      );

    if (columnsError) throw columnsError;

    columnIds = columns.map((column) => column.id);
  }

  if (columnIds.length > 0) {
    const { error: tasksError } = await supabase
      .from("tasks")
      .delete()
      .in("kanban_column_id", columnIds);

    if (tasksError) throw tasksError;

    const { error: deleteColumnsError } = await supabase
      .from("kanban_columns")
      .delete()
      .in("id", columnIds);

    if (deleteColumnsError) throw deleteColumnsError;
  }

  const { error: sprintsError } = await supabase
    .from("kanban_sprints")
    .delete()
    .eq("project_id", id);

  if (sprintsError) throw sprintsError;

  const { error: deleteBoardsError } = await supabase
    .from("kanban_boards")
    .delete()
    .eq("project_id", id);

  if (deleteBoardsError) throw deleteBoardsError;

  const { error: membersError } = await supabase
    .from("project_members")
    .delete()
    .eq("project_id", id);

  if (membersError) throw membersError;

  const { error: projectError } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (projectError) throw projectError;

  updateTag(CACHE_TAGS.projectsList);
  updateTag(CACHE_TAGS.kanbanBoard);
  updateTag(`${CACHE_TAGS.projectDetail}-${id}`);
}

"use server";

import { updateTag } from "next/cache";
import { ensureBoardForSprint } from "@/actions/home/kanban/board";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import {
  requirePermission,
  requireProjectAccess,
} from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { z } from "zod";

const createSprintInput = z.object({
  projectId: z.string().min(1),
  name: z.string().trim().min(1),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
});

export async function createSprint(input: {
  projectId: string;
  name: string;
  startAt: string;
  endAt: string;
}): Promise<{ sprintId: string }> {
  const { projectId, name, startAt, endAt } = createSprintInput.parse(input);

  await requirePermission("kanban");
  await requireProjectAccess(projectId, "team_leader");

  const supabase = await createClientServerComponent();

  const { data: sprint, error } = await supabase
    .from("kanban_sprints")
    .insert({
      project_id: projectId,
      name,
      start_at: startAt,
      end_at: endAt,
      board_id: null,
    })
    .select("id")
    .single();

  if (error) throw error;

  await ensureBoardForSprint(sprint.id);

  updateTag(CACHE_TAGS.kanbanBoard);

  return { sprintId: sprint.id };
}

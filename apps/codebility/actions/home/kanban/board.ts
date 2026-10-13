"use server";

import type { KanbanBoardSnapshot } from "@/types/home/kanban/kanban";
import { updateTag } from "next/cache";
import {
  DEFAULT_COLUMN_NAMES,
  SPRINT_COLUMNS,
} from "@/constants/home/kanban/kanban";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import {
  requirePermission,
  requireProjectAccessForEntities,
} from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { loadBoardSnapshot } from "@/lib/home/kanban/kanban-cached";
import { POSITION_GAP } from "@/utils/home/kanban/position";
import { z } from "zod";

const sprintIdSchema = z.string().min(1);

export async function getBoardSnapshot(
  sprintId: string,
): Promise<KanbanBoardSnapshot | null> {
  const id = sprintIdSchema.parse(sprintId);

  await requirePermission("kanban");
  await requireProjectAccessForEntities({ sprintId: id });

  const supabase = await createClientServerComponent();

  return loadBoardSnapshot(supabase, id);
}

export async function ensureBoardForSprint(
  sprintId: string,
): Promise<{ boardId: string }> {
  const id = sprintIdSchema.parse(sprintId);

  await requirePermission("kanban");
  await requireProjectAccessForEntities({ sprintId: id });

  const supabase = await createClientServerComponent();

  const { data: sprint, error: sprintError } = await supabase
    .from("kanban_sprints")
    .select(SPRINT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (sprintError) throw sprintError;
  if (!sprint) throw new Error("Sprint not found");
  if (sprint.board_id) return { boardId: sprint.board_id };

  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .insert({ name: sprint.name ?? "Board", project_id: sprint.project_id })
    .select("id")
    .single();

  if (boardError) throw boardError;

  const { error: columnsError } = await supabase.from("kanban_columns").insert(
    DEFAULT_COLUMN_NAMES.map((name, index) => ({
      board_id: board.id,
      name,
      position: (index + 1) * POSITION_GAP,
    })),
  );

  if (columnsError) throw columnsError;

  const { error: linkError } = await supabase
    .from("kanban_sprints")
    .update({ board_id: board.id })
    .eq("id", id);

  if (linkError) throw linkError;

  updateTag(CACHE_TAGS.kanbanBoard);

  return { boardId: board.id };
}

"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import {
  requirePermission,
  requireProjectAccess,
  requireTaskManager,
} from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { KanbanColumn } from "@/types/home/kanban/kanban";
import { POSITION_GAP } from "@/utils/home/kanban/position";
import { z } from "zod";

const boardIdSchema = z.string().min(1);
const columnIdSchema = z.string().min(1);
const nameSchema = z.string().trim().min(1).max(60);

async function requireColumnProject(
  supabase: Awaited<ReturnType<typeof createClientServerComponent>>,
  columnId: string,
): Promise<void> {
  const { data: column, error } = await supabase
    .from("kanban_columns")
    .select("board_id, kanban_boards(project_id)")
    .eq("id", columnId)
    .single();

  if (error) throw error;

  const projectId = column.kanban_boards?.project_id;

  if (!projectId) throw new Error("Column not found");

  await requireProjectAccess(projectId, "member");
}

export async function createColumn(
  boardId: string,
  name: string,
): Promise<KanbanColumn> {
  const parsedBoardId = boardIdSchema.parse(boardId);
  const parsedName = nameSchema.parse(name);

  await requirePermission("kanban");
  await requireTaskManager();

  const supabase = await createClientServerComponent();

  const { data: board, error: boardError } = await supabase
    .from("kanban_boards")
    .select("project_id")
    .eq("id", parsedBoardId)
    .single();

  if (boardError) throw boardError;

  if (!board.project_id) throw new Error("Board not found");

  await requireProjectAccess(board.project_id, "member");

  const { data: created, error: createError } = await supabase
    .rpc("create_kanban_column", {
      p_board_id: parsedBoardId,
      p_name: parsedName,
      p_gap: POSITION_GAP,
    })
    .single();

  if (createError) throw createError;

  updateTag(CACHE_TAGS.kanbanBoard);

  return { id: created.id, name: created.name, position: created.position };
}

export async function updateColumn(
  columnId: string,
  name: string,
): Promise<KanbanColumn> {
  const parsedColumnId = columnIdSchema.parse(columnId);
  const parsedName = nameSchema.parse(name);

  await requirePermission("kanban");
  await requireTaskManager();

  const supabase = await createClientServerComponent();

  await requireColumnProject(supabase, parsedColumnId);

  const { data: updated, error: updateError } = await supabase
    .from("kanban_columns")
    .update({ name: parsedName })
    .eq("id", parsedColumnId)
    .select("id, name, position")
    .single();

  if (updateError) throw updateError;

  updateTag(CACHE_TAGS.kanbanBoard);

  return { id: updated.id, name: updated.name, position: updated.position };
}

export async function deleteColumn(columnId: string): Promise<void> {
  const parsedColumnId = columnIdSchema.parse(columnId);

  await requirePermission("kanban");
  await requireTaskManager();

  const supabase = await createClientServerComponent();

  await requireColumnProject(supabase, parsedColumnId);

  const { error: deleteError } = await supabase.rpc("delete_kanban_column", {
    p_column_id: parsedColumnId,
  });

  if (deleteError) throw deleteError;

  updateTag(CACHE_TAGS.kanbanBoard);
}

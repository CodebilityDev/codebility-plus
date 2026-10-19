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
const nameSchema = z.string().trim().min(1).max(60);

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

  const { data: lastColumns, error } = await supabase
    .from("kanban_columns")
    .select("position")
    .eq("board_id", parsedBoardId)
    .order("position", { ascending: false })
    .limit(1);

  if (error) throw error;

  const { data: column, error: insertError } = await supabase
    .from("kanban_columns")
    .insert({
      board_id: parsedBoardId,
      name: parsedName,
      position: (lastColumns[0]?.position ?? 0) + POSITION_GAP,
    })
    .select("id, name, position")
    .single();

  if (insertError) throw insertError;

  updateTag(CACHE_TAGS.kanbanBoard);

  return { id: column.id, name: column.name, position: column.position };
}

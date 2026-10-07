"use server";

import { updateTag } from "next/cache";
import { TASK_COLUMNS } from "@/constants/home/kanban/kanban";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import {
  assignPositions,
  resolveIndex,
  resolvePosition,
} from "@/utils/home/kanban/position";
import { z } from "zod";

const moveTaskInput = z.object({
  taskId: z.string().min(1),
  toColumnId: z.string().min(1),
  beforeTaskId: z.string().min(1).nullable(),
  afterTaskId: z.string().min(1).nullable(),
});

const createTaskInput = z.object({
  columnId: z.string().min(1),
  title: z.string().trim().min(1),
  description: z.string().optional(),
  priority: z.string().optional(),
});

const updateTaskInput = z.object({
  taskId: z.string().min(1),
  title: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  priority: z.string().optional(),
});

const taskIdSchema = z.string().min(1);

export async function moveTask(input: {
  taskId: string;
  toColumnId: string;
  beforeTaskId: string | null;
  afterTaskId: string | null;
}): Promise<void> {
  const { taskId, toColumnId, beforeTaskId, afterTaskId } =
    moveTaskInput.parse(input);

  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .eq("kanban_column_id", toColumnId)
    .eq("is_archive", false)
    .neq("id", taskId)
    .order("position", { ascending: true });

  if (error) throw error;

  const ids = data.map((task) => task.id);
  const targetIndex = resolveIndex(ids, beforeTaskId, afterTaskId);

  const plan = resolvePosition(
    data[targetIndex - 1]?.position ?? null,
    data[targetIndex]?.position ?? null,
  );
  const updatedAt = new Date().toISOString();

  if (plan.renumber) {
    const orderedIds = data.map((task) => task.id);
    orderedIds.splice(targetIndex, 0, taskId);

    const results = await Promise.all(
      assignPositions(orderedIds).map((row) =>
        supabase
          .from("tasks")
          .update({
            kanban_column_id: toColumnId,
            position: row.position,
            updated_at: updatedAt,
          })
          .eq("id", row.id),
      ),
    );

    const failure = results.find((result) => result.error);
    if (failure?.error) throw failure.error;
  } else {
    const { error: moveError } = await supabase
      .from("tasks")
      .update({
        kanban_column_id: toColumnId,
        position: plan.position,
        updated_at: updatedAt,
      })
      .eq("id", taskId);

    if (moveError) throw moveError;
  }

  updateTag(CACHE_TAGS.kanbanBoard);
}

export async function createTask(input: {
  columnId: string;
  title: string;
  description?: string;
  priority?: string;
}): Promise<void> {
  const { columnId, title, description, priority } =
    createTaskInput.parse(input);

  const supabase = await createClientServerComponent();

  const { data: lastTasks, error } = await supabase
    .from("tasks")
    .select("position")
    .eq("kanban_column_id", columnId)
    .order("position", { ascending: false })
    .limit(1);

  if (error) throw error;

  const plan = resolvePosition(lastTasks[0]?.position ?? null, null);

  const { error: insertError } = await supabase.from("tasks").insert({
    kanban_column_id: columnId,
    title,
    description,
    priority,
    position: plan.position,
  });

  if (insertError) throw insertError;

  updateTag(CACHE_TAGS.kanbanBoard);
}

export async function updateTask(input: {
  taskId: string;
  title?: string;
  description?: string;
  priority?: string;
}): Promise<void> {
  const { taskId, title, description, priority } = updateTaskInput.parse(input);

  if (
    title === undefined &&
    description === undefined &&
    priority === undefined
  ) {
    return;
  }

  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      description,
      priority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId);

  if (error) throw error;

  updateTag(CACHE_TAGS.kanbanBoard);
}

export async function deleteTask(taskId: string): Promise<void> {
  const id = taskIdSchema.parse(taskId);

  const supabase = await createClientServerComponent();

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) throw error;

  updateTag(CACHE_TAGS.kanbanBoard);
}

"use server";

import { TASK_COLUMNS } from "@/constants/home/kanban/kanban";
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

const syncTaskMovesInput = z.object({
  moves: z.array(moveTaskInput).min(1).max(100),
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

export async function syncTaskMoves(input: {
  moves: {
    taskId: string;
    toColumnId: string;
    beforeTaskId: string | null;
    afterTaskId: string | null;
  }[];
}): Promise<void> {
  const { moves } = syncTaskMovesInput.parse(input);

  const supabase = await createClientServerComponent();
  const updatedAt = new Date().toISOString();

  const movedIds = moves.map((move) => move.taskId);

  const { data: located, error: locateError } = await supabase
    .from("tasks")
    .select("id, title, kanban_column_id, position")
    .in("id", movedIds)
    .eq("is_archive", false);

  if (locateError) throw locateError;

  const affectedColumnIds = [
    ...new Set([
      ...moves.map((move) => move.toColumnId),
      ...located.flatMap((task) =>
        task.kanban_column_id ? [task.kanban_column_id] : [],
      ),
    ]),
  ];

  const { data: columnTasks, error: columnError } = await supabase
    .from("tasks")
    .select(TASK_COLUMNS)
    .in("kanban_column_id", affectedColumnIds)
    .eq("is_archive", false)
    .order("position", { ascending: true });

  if (columnError) throw columnError;

  const locatedIds = new Set(located.map((task) => task.id));
  const titleById = new Map<string, string>();
  const columns = new Map<string, { id: string; position: number }[]>();
  const columnIdByTaskId = new Map<string, string>();

  for (const columnId of affectedColumnIds) columns.set(columnId, []);

  for (const task of located) titleById.set(task.id, task.title);

  for (const task of columnTasks) {
    const columnId = task.kanban_column_id;

    if (!columnId) continue;

    const column = columns.get(columnId);

    if (!column) continue;

    titleById.set(task.id, task.title);
    columnIdByTaskId.set(task.id, columnId);
    column.push({ id: task.id, position: task.position });
  }

  const changes = new Map<string, { columnId: string; position: number }>();

  for (const move of moves) {
    const { taskId, toColumnId, beforeTaskId, afterTaskId } = move;

    if (!locatedIds.has(taskId)) continue;

    const sourceColumnId = columnIdByTaskId.get(taskId);

    if (sourceColumnId) {
      const source = columns.get(sourceColumnId);

      if (source) {
        const sourceIndex = source.findIndex((row) => row.id === taskId);

        if (sourceIndex !== -1) source.splice(sourceIndex, 1);
      }

      columnIdByTaskId.delete(taskId);
    }

    const destination = columns.get(toColumnId);

    if (!destination) continue;

    const targetIndex = resolveIndex(
      destination.map((row) => row.id),
      beforeTaskId,
      afterTaskId,
    );

    const plan = resolvePosition(
      destination[targetIndex - 1]?.position ?? null,
      destination[targetIndex]?.position ?? null,
    );

    if (plan.renumber) {
      const orderedIds = destination.map((row) => row.id);
      orderedIds.splice(targetIndex, 0, taskId);

      const positions = assignPositions(orderedIds);

      columns.set(toColumnId, positions);

      for (const row of positions) {
        columnIdByTaskId.set(row.id, toColumnId);
        changes.set(row.id, { columnId: toColumnId, position: row.position });
      }
    } else {
      destination.splice(targetIndex, 0, {
        id: taskId,
        position: plan.position,
      });
      columnIdByTaskId.set(taskId, toColumnId);
      changes.set(taskId, { columnId: toColumnId, position: plan.position });
    }
  }

  const rows = [...changes].flatMap(([id, change]) => {
    const title = titleById.get(id);

    if (title === undefined) return [];

    return [
      {
        id,
        title,
        kanban_column_id: change.columnId,
        position: change.position,
        updated_at: updatedAt,
      },
    ];
  });

  if (rows.length > 0) {
    const { error: upsertError } = await supabase.from("tasks").upsert(rows);

    if (upsertError) throw upsertError;
  }
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
}

export async function deleteTask(taskId: string): Promise<void> {
  const id = taskIdSchema.parse(taskId);

  const supabase = await createClientServerComponent();

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) throw error;
}

"use client";

import { useEffect } from "react";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { z } from "zod";

import { createClientClientComponent } from "@/lib/global/supabase-client";
import { resolveIndex } from "@/utils/home/kanban/position";
import type { KanbanStoreApi } from "@/store/home/kanban/kanban-store";
import type { Database } from "@/types/global/supabase";
import type { KanbanTask } from "@/types/home/kanban/kanban";

type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
type ColumnRow = Database["public"]["Tables"]["kanban_columns"]["Row"];

interface UseKanbanRealtimeOptions {
  store: KanbanStoreApi;
  boardId: string;
  sprintId: string;
}

const moveBroadcast = z.object({
  taskId: z.string().min(1),
  toColumnId: z.string().min(1),
  beforeTaskId: z.string().min(1).nullable(),
  afterTaskId: z.string().min(1).nullable(),
});

function toTask(row: TaskRow): KanbanTask | null {
  if (!row.kanban_column_id || row.is_archive) return null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    columnId: row.kanban_column_id,
    position: row.position,
    priority: row.priority,
    codevId: row.codev_id,
    dueDate: row.due_date,
    updatedAt: row.updated_at,
  };
}

export function useKanbanRealtime({
  store,
  boardId,
  sprintId,
}: UseKanbanRealtimeOptions) {
  useEffect(() => {
    const supabase = createClientClientComponent();

    if (!supabase) {
      store.getState().setConnection("offline");
      return;
    }

    const isBoardColumn = (columnId: string) =>
      columnId in store.getState().columnsById;

    store.getState().setConnection("connecting");

    const channel = supabase
      .channel(`kanban-board-${boardId}`)
      .on<ColumnRow>(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kanban_columns",
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            if (typeof payload.old.id === "string") {
              store.getState().removeColumn(payload.old.id);
            }

            return;
          }

          store.getState().upsertColumn({
            id: payload.new.id,
            name: payload.new.name,
            position: payload.new.position,
          });
        },
      )
      .on<TaskRow>(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "DELETE") {
            const id = payload.old.id;
            const columnId = payload.old.kanban_column_id;

            if (id && columnId && isBoardColumn(columnId)) {
              store.getState().removeTask(id);
            }

            return;
          }

          const task = toTask(payload.new);

          if (task && isBoardColumn(task.columnId)) {
            store.getState().upsertTask(task);
          }
        },
      )
      .on("broadcast", { event: "move" }, ({ payload }) => {
        const move = moveBroadcast.safeParse(payload);

        if (!move.success) return;

        const state = store.getState();

        if (!state.tasksById[move.data.taskId]) return;

        const rest = (state.taskIdsByColumn[move.data.toColumnId] ?? []).filter(
          (id) => id !== move.data.taskId,
        );
        const index = resolveIndex(
          rest,
          move.data.beforeTaskId,
          move.data.afterTaskId,
        );

        state.moveTaskLocally(move.data.taskId, move.data.toColumnId, index);
      })
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          store.getState().setConnection("offline");
          return;
        }

        store.getState().setConnection("live");
        store.getState().setBroadcastMove((move) => {
          void channel.send({ type: "broadcast", event: "move", payload: move });
        });
      });

    return () => {
      store.getState().setBroadcastMove(null);
      void supabase.removeChannel(channel);
    };
  }, [store, boardId, sprintId]);
}

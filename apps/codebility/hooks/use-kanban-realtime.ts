"use client";

import { useEffect, useRef } from "react";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

import {
  registerKanbanBroadcastChannel,
  unregisterKanbanBroadcastChannel,
} from "@/lib/kanban/board-broadcast";
import {
  bindPostgresSyncQueue,
  enqueuePostgresColumnChange,
  enqueuePostgresTaskChange,
  unbindPostgresSyncQueue,
} from "@/lib/kanban/postgres-board-sync";
import {
  registerBroadcastApplied,
  shouldIgnoreRemoteColumnPatches,
  shouldIgnoreRemoteTask,
} from "@/lib/kanban/own-writes";
import type { KanbanBoardStoreApi } from "@/store/kanban-board/create-kanban-board-store";
import { Task } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

type TaskRow = Record<string, unknown>;
type ColumnRow = Record<string, unknown>;

type TaskMovePayload = {
  taskId: string;
  columnId: string;
  position: number;
};

type TaskPatchPayload = {
  taskId: string;
  patch: Partial<Task>;
};

type ColumnsReorderPayload = {
  columns: Array<{ id: string; position: number }>;
};

async function syncRealtimeAuth(
  supabase: NonNullable<ReturnType<typeof createClientClientComponent>>,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    await supabase.realtime.setAuth(session.access_token);
    return true;
  }

  return false;
}

function applyBroadcastTaskMove(
  store: KanbanBoardStoreApi,
  payload: TaskMovePayload,
) {
  if (shouldIgnoreRemoteTask(payload.taskId)) {
    return;
  }

  const state = store.getState();
  const sourceColumn = state.columns.find((column) =>
    (column.tasks ?? []).some((task) => task.id === payload.taskId),
  );
  const targetColumn = state.columns.find(
    (column) => column.id === payload.columnId,
  );

  for (const column of [sourceColumn, targetColumn]) {
    if (!column) {
      continue;
    }

    for (const task of column.tasks ?? []) {
      registerBroadcastApplied(task.id);
    }
  }

  store
    .getState()
    .moveTaskLocal(payload.taskId, payload.columnId, payload.position);
}

function applyBroadcastTaskRemove(
  store: KanbanBoardStoreApi,
  payload: { taskId: string },
) {
  if (shouldIgnoreRemoteTask(payload.taskId)) {
    return;
  }

  registerBroadcastApplied(payload.taskId);
  store.getState().removeTaskLocal(payload.taskId);
}

function applyBroadcastTaskPatch(
  store: KanbanBoardStoreApi,
  payload: TaskPatchPayload,
) {
  if (shouldIgnoreRemoteTask(payload.taskId)) {
    return;
  }

  registerBroadcastApplied(payload.taskId);
  store.getState().patchTaskLocal(payload.taskId, payload.patch);
}

function applyBroadcastColumnsReorder(
  store: KanbanBoardStoreApi,
  payload: ColumnsReorderPayload,
) {
  if (shouldIgnoreRemoteColumnPatches()) {
    return;
  }

  const positions = new Map(
    payload.columns.map((column) => [column.id, column.position]),
  );

  const nextColumns = store
    .getState()
    .columns.map((column) => {
      const position = positions.get(column.id);
      return position === undefined ? column : { ...column, position };
    })
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  store.getState().setColumns(nextColumns);
}

type UseKanbanRealtimeOptions = {
  boardId: string;
  store: KanbanBoardStoreApi;
  onReconnect: () => void;
};

export function useKanbanRealtime({
  boardId,
  store,
  onReconnect,
}: UseKanbanRealtimeOptions) {
  const onReconnectRef = useRef(onReconnect);
  onReconnectRef.current = onReconnect;

  useEffect(() => {
    const supabase = createClientClientComponent();
    if (!supabase) {
      return;
    }

    let channel: RealtimeChannel | null = null;
    let needsReconnectRefresh = false;
    let disposed = false;

    const getColumnIds = () =>
      new Set(store.getState().columns.map((column) => column.id));

    bindPostgresSyncQueue(boardId, store, getColumnIds);

    const handleChannelStatus = (status: string, err?: Error) => {
      if (err && process.env.NODE_ENV === "development") {
        console.error("[kanban-realtime] subscription error:", err);
      }

      if (status === "SUBSCRIBED") {
        if (channel) {
          registerKanbanBroadcastChannel(channel, boardId);
        }

        if (needsReconnectRefresh) {
          needsReconnectRefresh = false;
          onReconnectRef.current();
        }
        return;
      }

      if (
        status === "CLOSED" ||
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT"
      ) {
        needsReconnectRefresh = true;
        if (channel) {
          unregisterKanbanBroadcastChannel(channel);
        }
      }
    };

    const removeChannel = () => {
      if (channel) {
        unregisterKanbanBroadcastChannel(channel);
        supabase.removeChannel(channel);
        channel = null;
      }
    };

    const subscribe = async () => {
      if (disposed) {
        return;
      }

      const authed = await syncRealtimeAuth(supabase);
      if (!authed || disposed) {
        return;
      }

      removeChannel();

      const columnIds = getColumnIds();

      channel = supabase.channel(`kanban-board:${boardId}`, {
        config: { broadcast: { self: false } },
      });

      channel
        .on("broadcast", { event: "task_move" }, ({ payload }) => {
          applyBroadcastTaskMove(store, payload as TaskMovePayload);
        })
        .on("broadcast", { event: "task_remove" }, ({ payload }) => {
          applyBroadcastTaskRemove(store, payload as { taskId: string });
        })
        .on("broadcast", { event: "task_patch" }, ({ payload }) => {
          applyBroadcastTaskPatch(store, payload as TaskPatchPayload);
        })
        .on("broadcast", { event: "columns_reorder" }, ({ payload }) => {
          applyBroadcastColumnsReorder(store, payload as ColumnsReorderPayload);
        })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "kanban_columns",
            filter: `board_id=eq.${boardId}`,
          },
          (payload) => {
            enqueuePostgresColumnChange(
              boardId,
              payload as RealtimePostgresChangesPayload<ColumnRow>,
            );
          },
        );

      for (const columnId of columnIds) {
        channel.on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "tasks",
            filter: `kanban_column_id=eq.${columnId}`,
          },
          (payload) => {
            enqueuePostgresTaskChange(
              boardId,
              payload as RealtimePostgresChangesPayload<TaskRow>,
            );
          },
        );
      }

      channel.subscribe(handleChannelStatus);
    };

    void subscribe();

    let previousColumnIds = new Set(
      store.getState().columns.map((column) => column.id),
    );

    const unsubscribeColumns = store.subscribe((state) => {
      const nextColumnIds = new Set(state.columns.map((column) => column.id));
      const structureChanged =
        nextColumnIds.size !== previousColumnIds.size ||
        [...nextColumnIds].some((id) => !previousColumnIds.has(id));

      if (structureChanged) {
        previousColumnIds = nextColumnIds;
        void subscribe();
      }
    });

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (disposed || !session?.access_token) {
        return;
      }

      void supabase.realtime.setAuth(session.access_token);
    });

    return () => {
      disposed = true;
      authSubscription.unsubscribe();
      unsubscribeColumns();
      removeChannel();
      unbindPostgresSyncQueue(boardId);
    };
  }, [boardId, store]);
}

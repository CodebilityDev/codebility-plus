"use client";

import { useCallback, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

import {
  registerKanbanBroadcastChannel,
  unregisterKanbanBroadcastChannel,
} from "@/lib/kanban/board-broadcast";
import {
  cancelBoardSnapshotSave,
  flushBoardSnapshotOnExit,
  resumeBoardSnapshotSave,
} from "@/lib/kanban/board-snapshot-save";
import type { KanbanBoardStoreApi } from "@/store/kanban-board/create-kanban-board-store";
import { Task } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

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

function taskAlreadyAt(
  store: KanbanBoardStoreApi,
  taskId: string,
  columnId: string,
  position: number,
): boolean {
  for (const column of store.getState().columns) {
    if (column.id !== columnId) {
      continue;
    }

    const task = (column.tasks ?? []).find((entry) => entry.id === taskId);
    return task !== undefined && (task.position ?? 0) === position;
  }

  return false;
}

function applyBroadcastTaskMove(
  store: KanbanBoardStoreApi,
  payload: TaskMovePayload,
) {
  if (
    taskAlreadyAt(
      store,
      payload.taskId,
      payload.columnId,
      payload.position,
    )
  ) {
    return;
  }

  store
    .getState()
    .moveTaskLocal(payload.taskId, payload.columnId, payload.position);
}

function applyBroadcastTaskRemove(
  store: KanbanBoardStoreApi,
  payload: { taskId: string },
) {
  const exists = store
    .getState()
    .columns.some((column) =>
      (column.tasks ?? []).some((task) => task.id === payload.taskId),
    );

  if (!exists) {
    return;
  }

  store.getState().removeTaskLocal(payload.taskId);
}

function applyBroadcastTaskPatch(
  store: KanbanBoardStoreApi,
  payload: TaskPatchPayload,
) {
  store.getState().patchTaskLocal(payload.taskId, payload.patch);
}

function applyBroadcastColumnsReorder(
  store: KanbanBoardStoreApi,
  payload: ColumnsReorderPayload,
) {
  const positions = new Map(
    payload.columns.map((column) => [column.id, column.position]),
  );

  const current = store.getState().columns;
  const alreadyMatches = current.every((column) => {
    const position = positions.get(column.id);
    return position === undefined || (column.position ?? 0) === position;
  });

  if (alreadyMatches) {
    return;
  }

  const nextColumns = current
    .map((column) => {
      const position = positions.get(column.id);
      return position === undefined ? column : { ...column, position };
    })
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  store.getState().setColumns(nextColumns);
}

export function attachKanbanRealtime(
  boardId: string,
  store: KanbanBoardStoreApi,
): () => void {
  const supabase = createClientClientComponent();
  if (!supabase) {
    return () => {};
  }

  let channel: RealtimeChannel | null = null;
  let disposed = false;

  const handleChannelStatus = (status: string, err?: Error) => {
    if (disposed) {
      return;
    }

    if (err && process.env.NODE_ENV === "development") {
      console.error("[kanban-realtime] subscription error:", err);
    }

    if (status === "SUBSCRIBED" && channel) {
      registerKanbanBroadcastChannel(channel, boardId);
    }

    if (
      status === "CLOSED" ||
      status === "CHANNEL_ERROR" ||
      status === "TIMED_OUT"
    ) {
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

    if (disposed) {
      return;
    }

    const nextChannel = supabase.channel(`kanban-board:${boardId}`, {
      config: { broadcast: { self: false } },
    });

    nextChannel
      .on("broadcast", { event: "task_move" }, ({ payload }) => {
        if (disposed) {
          return;
        }

        applyBroadcastTaskMove(store, payload as TaskMovePayload);
      })
      .on("broadcast", { event: "task_remove" }, ({ payload }) => {
        if (disposed) {
          return;
        }

        applyBroadcastTaskRemove(store, payload as { taskId: string });
      })
      .on("broadcast", { event: "task_patch" }, ({ payload }) => {
        if (disposed) {
          return;
        }

        applyBroadcastTaskPatch(store, payload as TaskPatchPayload);
      })
      .on("broadcast", { event: "columns_reorder" }, ({ payload }) => {
        if (disposed) {
          return;
        }

        applyBroadcastColumnsReorder(store, payload as ColumnsReorderPayload);
      });

    if (disposed) {
      supabase.removeChannel(nextChannel);
      return;
    }

    channel = nextChannel;
    channel.subscribe(handleChannelStatus);
  };

  void subscribe();

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
    removeChannel();
  };
}

type KanbanRealtimeHostProps = {
  boardId: string;
  store: KanbanBoardStoreApi;
};

export function KanbanRealtimeHost({ boardId, store }: KanbanRealtimeHostProps) {
  const detachRef = useRef<(() => void) | null>(null);

  const hostRef = useCallback(
    (node: HTMLSpanElement | null) => {
      if (node) {
        detachRef.current?.();
        detachRef.current = attachKanbanRealtime(boardId, store);
        resumeBoardSnapshotSave(boardId);
        return;
      }

      cancelBoardSnapshotSave();
      flushBoardSnapshotOnExit(boardId);
      detachRef.current?.();
      detachRef.current = null;
    },
    [boardId, store],
  );

  return <span ref={hostRef} hidden aria-hidden className="hidden" />;
}

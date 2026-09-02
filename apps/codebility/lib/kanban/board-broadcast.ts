import type { RealtimeChannel } from "@supabase/supabase-js";

import type { Task } from "@/types/home/codev";

let activeChannel: RealtimeChannel | null = null;
let activeBoardId: string | null = null;

export function registerKanbanBroadcastChannel(
  channel: RealtimeChannel,
  boardId: string,
): void {
  activeChannel = channel;
  activeBoardId = boardId;
}

export function unregisterKanbanBroadcastChannel(channel: RealtimeChannel): void {
  if (activeChannel === channel) {
    activeChannel = null;
    activeBoardId = null;
  }
}

function send(boardId: string, event: string, payload: unknown): void {
  if (!activeChannel || activeBoardId !== boardId) {
    return;
  }

  void activeChannel.send({
    type: "broadcast",
    event,
    payload,
  });
}

export function broadcastTaskMove(
  boardId: string,
  payload: { taskId: string; columnId: string; position: number },
): void {
  send(boardId, "task_move", payload);
}

export function broadcastTaskRemove(boardId: string, taskId: string): void {
  send(boardId, "task_remove", { taskId });
}

export function broadcastTaskPatch(
  boardId: string,
  payload: { taskId: string; patch: Partial<Task> },
): void {
  send(boardId, "task_patch", payload);
}

export function broadcastColumnsReorder(
  boardId: string,
  payload: { columns: Array<{ id: string; position: number }> },
): void {
  send(boardId, "columns_reorder", payload);
}

"use client";

import type { BoardSnapshotInput } from "@/lib/kanban/board-snapshot-types";
import {
  beginBoardSnapshotSync,
  endBoardSnapshotSync,
} from "@/lib/kanban/board-sync-status";
import toast from "react-hot-toast";
const IDLE_MS = 1500;
const SNAPSHOT_API_PATH = "/api/kanban/board-snapshot";

async function persistBoardSnapshot(
  snapshot: BoardSnapshotInput,
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(SNAPSHOT_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snapshot),
  });

  const result = (await response.json()) as {
    success: boolean;
    error?: string;
  };

  if (!response.ok && !result.error) {
    return { success: false, error: "Failed to save board changes" };
  }

  return result;
}

function persistBoardSnapshotKeepalive(snapshot: BoardSnapshotInput): void {
  void fetch(SNAPSHOT_API_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(snapshot),
    keepalive: true,
  });
}

type PendingTaskMove = {
  id: string;
  kanban_column_id: string;
  position: number;
};

type PendingColumnMove = {
  id: string;
  position: number;
};

let idleTimer: ReturnType<typeof setTimeout> | null = null;
let flushPromise: Promise<{ success: boolean; error?: string }> | null = null;
let pendingBoardId: string | null = null;
let pendingProjectId: string | null = null;
const pendingTaskMoves = new Map<string, PendingTaskMove>();
const pendingColumnMoves = new Map<string, PendingColumnMove>();

function hasPendingOriginatorMutations(): boolean {
  return pendingTaskMoves.size > 0 || pendingColumnMoves.size > 0;
}

function buildPendingSnapshot(boardId: string): BoardSnapshotInput | null {
  if (
    !pendingProjectId ||
    pendingBoardId !== boardId ||
    !hasPendingOriginatorMutations()
  ) {
    return null;
  }

  return {
    boardId,
    projectId: pendingProjectId,
    columns: [...pendingColumnMoves.values()],
    tasks: [...pendingTaskMoves.values()],
  };
}

function clearPendingSnapshot() {
  pendingTaskMoves.clear();
  pendingColumnMoves.clear();
  pendingBoardId = null;
  pendingProjectId = null;
}

function scheduleOriginatorFlush() {
  if (idleTimer) {
    clearTimeout(idleTimer);
  }

  idleTimer = setTimeout(() => {
    idleTimer = null;
    if (pendingBoardId) {
      void flushBoardSnapshot(pendingBoardId);
    }
  }, IDLE_MS);
}

export function queueOriginatorTaskMove(
  boardId: string,
  projectId: string,
  taskId: string,
  columnId: string,
  position: number,
) {
  pendingBoardId = boardId;
  pendingProjectId = projectId;
  pendingTaskMoves.set(taskId, {
    id: taskId,
    kanban_column_id: columnId,
    position,
  });
  scheduleOriginatorFlush();
}

export function queueOriginatorColumnsReorder(
  boardId: string,
  projectId: string,
  columns: Array<{ id: string; position: number }>,
) {
  pendingBoardId = boardId;
  pendingProjectId = projectId;

  for (const column of columns) {
    pendingColumnMoves.set(column.id, column);
  }

  scheduleOriginatorFlush();
}

export function resumeBoardSnapshotSave(boardId: string) {
  if (pendingBoardId === boardId && hasPendingOriginatorMutations()) {
    scheduleOriginatorFlush();
  }
}

/**
 * Best-effort persist for page unload / board unmount.
 * Uses fetch keepalive so the request survives refresh and hard navigation.
 */
export function flushBoardSnapshotOnExit(boardId: string): void {
  const snapshot = buildPendingSnapshot(boardId);
  if (!snapshot) {
    return;
  }

  cancelBoardSnapshotSave();
  clearPendingSnapshot();
  persistBoardSnapshotKeepalive(snapshot);
}

export function flushBoardSnapshot(
  boardId: string,
): Promise<{ success: boolean; error?: string }> {
  if (!hasPendingOriginatorMutations()) {
    return Promise.resolve({ success: true });
  }

  if (pendingBoardId !== boardId) {
    return Promise.resolve({ success: true });
  }

  if (flushPromise) {
    return flushPromise;
  }

  flushPromise = (async () => {
    const snapshot = buildPendingSnapshot(boardId);
    if (!snapshot) {
      return { success: true };
    }

    beginBoardSnapshotSync();

    try {
      const result = await persistBoardSnapshot(snapshot);

      if (!result.success) {
        toast.error(result.error ?? "Failed to save board changes");
        return result;
      }

      clearPendingSnapshot();

      return result;
    } catch (error) {
      console.error("Board originator save failed:", error);
      toast.error("Failed to save board changes");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Save failed",
      };
    } finally {
      endBoardSnapshotSync();
      flushPromise = null;
    }
  })();
  return flushPromise;
}

export function cancelBoardSnapshotSave() {
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
}

if (typeof window !== "undefined") {
  const flushPendingOnPageExit = () => {
    if (!pendingBoardId || !hasPendingOriginatorMutations()) {
      return;
    }

    flushBoardSnapshotOnExit(pendingBoardId);
  };

  window.addEventListener("pagehide", flushPendingOnPageExit);
  window.addEventListener("beforeunload", flushPendingOnPageExit);
}

"use client";

import { useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";

import {
  getIsBoardSnapshotSyncing,
  subscribeBoardSnapshotSync,
} from "@/lib/kanban/board-sync-status";

export default function KanbanBoardSyncIndicator() {
  const isSyncing = useSyncExternalStore(
    subscribeBoardSnapshotSync,
    getIsBoardSnapshotSyncing,
    () => false,
  );

  if (!isSyncing) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-2 py-0.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
      aria-live="polite"
      role="status"
    >
      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
      Saving
    </span>
  );
}

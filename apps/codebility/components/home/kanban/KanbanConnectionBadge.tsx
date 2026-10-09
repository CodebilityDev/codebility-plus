"use client";

import { Loader2Icon } from "lucide-react";

import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

import { useKanbanStore } from "@/providers/home/kanban/KanbanStoreProvider";
import type { KanbanConnection } from "@/types/home/kanban/kanban";

const LABELS: Record<KanbanConnection, string> = {
  connecting: "Connecting",
  live: "Live",
  offline: "Offline",
};

const DOT_CLASSES: Record<KanbanConnection, string> = {
  connecting: "animate-pulse bg-amber-500",
  live: "bg-green-500",
  offline: "bg-gray-400",
};

export default function KanbanConnectionBadge() {
  const connection = useKanbanStore((state) => state.connection);
  const pending = useKanbanStore(
    (state) => Object.keys(state.pending).length > 0,
  );
  const syncing = useKanbanStore((state) => state.syncing);
  const showPending = !syncing && pending && connection === "live";

  return (
    <Badge
      role="status"
      variant="outline"
      className="gap-2 rounded-full border-gray-200 bg-white px-3 py-1 font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
    >
      {syncing ? (
        <Loader2Icon aria-hidden="true" className="h-4 w-4 animate-spin" />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "h-2 w-2 rounded-full",
            showPending ? "bg-amber-500" : DOT_CLASSES[connection],
          )}
        />
      )}
      {syncing ? "Syncing" : showPending ? "Pending" : LABELS[connection]}
    </Badge>
  );
}

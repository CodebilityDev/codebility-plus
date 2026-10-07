"use client";

import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@codevs/ui";
import type { BadgeProps } from "@codevs/ui/badge";
import { Badge } from "@codevs/ui/badge";
import { Card } from "@codevs/ui/card";

import { useKanbanStore } from "@/providers/home/kanban/KanbanStoreProvider";

const PRIORITY_VARIANTS: Partial<Record<string, BadgeProps["variant"]>> = {
  low: "secondary",
  medium: "info",
  high: "warning",
  urgent: "destructive",
};

interface KanbanTaskCardFaceProps {
  title: string;
  priority: string | null;
  dueDate: string | null;
  pending?: boolean;
  dragging?: boolean;
}

export function KanbanTaskCardFace({
  title,
  priority,
  dueDate,
  pending = false,
  dragging = false,
}: KanbanTaskCardFaceProps) {
  const priorityVariant = priority
    ? PRIORITY_VARIANTS[priority.toLowerCase()]
    : undefined;

  return (
    <Card
      className={cn(
        "p-3",
        pending && "opacity-60",
        dragging && "shadow-lg ring-2 ring-customBlue-100",
      )}
    >
      <p className="text-sm font-medium break-words text-gray-900 dark:text-gray-100">
        {title}
      </p>
      {priorityVariant || dueDate ? (
        <div className="mt-2 flex items-center justify-between gap-2">
          {priorityVariant ? (
            <Badge
              variant={priorityVariant}
              className="rounded px-2 text-xs font-medium"
            >
              {priority}
            </Badge>
          ) : null}
          {dueDate ? (
            <time
              dateTime={dueDate}
              className="text-xs text-gray-500 dark:text-gray-400"
            >
              {dueDate}
            </time>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

interface KanbanTaskCardProps {
  taskId: string;
  columnId: string;
  index: number;
}

const KanbanTaskCard = memo(function KanbanTaskCard({
  taskId,
  columnId,
  index,
}: KanbanTaskCardProps) {
  const task = useKanbanStore((state) => state.tasksById[taskId]);
  const pending = useKanbanStore((state) => state.pending[taskId] ?? false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskId, data: { type: "task", columnId, index } });

  if (!task) {
    return null;
  }

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "manipulation",
      }}
      className={cn(
        "list-none rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-customBlue-100",
        isDragging && "opacity-40",
      )}
      {...attributes}
      {...listeners}
      aria-label={`Task ${task.title}`}
    >
      <KanbanTaskCardFace
        title={task.title}
        priority={task.priority}
        dueDate={task.dueDate}
        pending={pending}
      />
    </li>
  );
});

export default KanbanTaskCard;

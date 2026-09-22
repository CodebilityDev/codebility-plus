"use client";

import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";

import { useColumnTasksInfinite } from "@/hooks/kanban/use-column-tasks-infinite";
import { ExtendedTask } from "@/types/home/codev";

import KanbanTask from "./KanbanTask";

const ESTIMATED_TASK_ROW_HEIGHT = 132;

interface Props {
  columnId: string;
  tasks: ExtendedTask[];
  onTaskComplete: (taskId: string) => void;
  availableColumns: Array<{ id: string; name: string }>;
}

export default function KanbanColumnVirtualList({
  columnId,
  tasks,
  onTaskComplete,
  availableColumns,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { hasMore, isLoadingMore, loadMore } = useColumnTasksInfinite(columnId);

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [tasks],
  );

  const taskIds = useMemo(
    () => sortedTasks.map((task) => task.id),
    [sortedTasks],
  );

  const rowCount = hasMore ? sortedTasks.length + 1 : sortedTasks.length;

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_TASK_ROW_HEIGHT,
    gap: 8,
    overscan: 4,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= sortedTasks.length - 1 &&
      hasMore &&
      !isLoadingMore
    ) {
      void loadMore();
    }
  }, [
    hasMore,
    isLoadingMore,
    loadMore,
    sortedTasks.length,
    virtualItems,
  ]);

  if (sortedTasks.length === 0 && !hasMore) {
    return (
      <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-400 md:text-sm">
        No tasks in this column
      </div>
    );
  }

  return (
    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
      <div
        ref={scrollRef}
        className="max-h-[calc(100vh-16rem)] min-h-[100px] overflow-y-auto overflow-x-hidden pr-1"
      >
        <div
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index >= sortedTasks.length;
            const task = sortedTasks[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <div className="flex items-center justify-center py-3 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading more tasks...
                  </div>
                ) : task ? (
                  <KanbanTask
                    task={task}
                    columnId={columnId}
                    onComplete={onTaskComplete}
                    availableColumns={availableColumns}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </SortableContext>
  );
}

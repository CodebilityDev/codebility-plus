"use client";

import { memo, useCallback, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { defaultRangeExtractor, useVirtualizer } from "@tanstack/react-virtual";
import type { Range } from "@tanstack/react-virtual";

import { cn } from "@codevs/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";

import KanbanTaskCard from "@/components/home/kanban/KanbanTaskCard";
import KanbanTaskComposer from "@/components/home/kanban/KanbanTaskComposer";
import { useKanbanStore } from "@/providers/home/kanban/KanbanStoreProvider";

const NO_TASKS: string[] = [];
const CARD_GAP = 8;
const CARD_ESTIMATE = 76;
const OVERSCAN = 6;

const KanbanColumn = memo(function KanbanColumn({
  columnId,
}: {
  columnId: string;
}) {
  const column = useKanbanStore((state) => state.columnsById[columnId]);
  const taskIds = useKanbanStore(
    (state) => state.taskIdsByColumn[columnId] ?? NO_TASKS,
  );
  const activeTaskId = useKanbanStore((state) => state.activeTaskId);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: "column", columnId, index: taskIds.length },
  });

  const setCardContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollRef.current = node;
      setNodeRef(node);
    },
    [setNodeRef],
  );

  const activeIndex = activeTaskId ? taskIds.indexOf(activeTaskId) : -1;

  const rangeExtractor = useCallback(
    (range: Range) => {
      const indexes = defaultRangeExtractor(range);
      if (activeIndex >= 0 && !indexes.includes(activeIndex)) {
        indexes.push(activeIndex);
        indexes.sort((a, b) => a - b);
      }
      return indexes;
    },
    [activeIndex],
  );

  const virtualizer = useVirtualizer({
    count: taskIds.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => CARD_ESTIMATE,
    gap: CARD_GAP,
    overscan: OVERSCAN,
    rangeExtractor,
  });

  if (!column) {
    return null;
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <Card
      role="region"
      aria-label={`${column.name} column`}
      className="flex w-72 shrink-0 flex-col"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 p-3">
        <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          {column.name}
        </CardTitle>
        <span
          aria-label={`${taskIds.length} tasks`}
          className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          {taskIds.length}
        </span>
      </CardHeader>
      <CardContent
        ref={setCardContentRef}
        className={cn(
          "flex max-h-[70vh] min-h-24 flex-1 flex-col gap-2 overflow-y-auto p-2 transition-colors",
          isOver && "bg-customBlue-50/60 dark:bg-customBlue-500/10",
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <ul
            className="relative shrink-0 list-none"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualItems.map((item) => {
              const taskId = taskIds[item.index];
              if (!taskId) {
                return null;
              }
              return (
                <KanbanTaskCard
                  key={taskId}
                  taskId={taskId}
                  columnId={columnId}
                  index={item.index}
                  start={item.start}
                  measureRef={virtualizer.measureElement}
                />
              );
            })}
          </ul>
        </SortableContext>
        <KanbanTaskComposer columnId={columnId} />
      </CardContent>
    </Card>
  );
});

export default KanbanColumn;

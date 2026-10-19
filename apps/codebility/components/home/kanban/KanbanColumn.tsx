"use client";

import { memo, useCallback, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { defaultRangeExtractor, useVirtualizer } from "@tanstack/react-virtual";
import type { Range } from "@tanstack/react-virtual";
import { MoreVertical, Plus } from "lucide-react";

import { cn } from "@codevs/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { Button } from "@/components/global/ui/button";
import OverlayTrigger from "@/components/global/OverlayTrigger";
import KanbanTaskCard from "@/components/home/kanban/KanbanTaskCard";
import { useModal } from "@/hooks/global/use-modal";
import { useColumnActions } from "@/hooks/home/kanban/use-column-actions";
import { useKanbanStore } from "@/providers/home/kanban/KanbanStoreProvider";

const NO_TASKS: string[] = [];
const CARD_GAP = 8;
const CARD_ESTIMATE = 76;
const OVERSCAN = 6;

const KanbanColumn = memo(function KanbanColumn({
  columnId,
  canManage,
}: {
  columnId: string;
  canManage: boolean;
}) {
  const column = useKanbanStore((state) => state.columnsById[columnId]);
  const taskIds = useKanbanStore(
    (state) => state.taskIdsByColumn[columnId] ?? NO_TASKS,
  );
  const activeTaskId = useKanbanStore((state) => state.activeTaskId);
  const boardId = useKanbanStore((state) => state.boardId);
  const onOpen = useModal((state) => state.onOpen);
  const { confirmDeleteColumn } = useColumnActions();
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
      className="flex h-full w-72 shrink-0 flex-col"
    >
      <CardHeader className="flex shrink-0 flex-row items-center justify-between gap-2 space-y-0 p-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {column.name}
          </CardTitle>
          <span
            aria-label={`${taskIds.length} tasks`}
            className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            {taskIds.length}
          </span>
        </div>
        {canManage ? (
          <div className="flex shrink-0 items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Column options"
                  className="h-7 w-7 !p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() =>
                    onOpen("columnCreateDrawer", { boardId, columnId })
                  }
                >
                  Edit column
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => confirmDeleteColumn(columnId)}>
                  Delete column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <OverlayTrigger
              type="taskCreateDrawer"
              data={{ columnId }}
              className="h-7 w-7 shrink-0 !p-0 bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add a task to this column</span>
            </OverlayTrigger>
          </div>
        ) : null}
      </CardHeader>
      <CardContent
        ref={setCardContentRef}
        className={cn(
          "kanban-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2 transition-colors",
          isOver && "bg-customBlue-50/60 dark:bg-customBlue-500/10",
        )}
      >
        {taskIds.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400 dark:text-gray-500">
            No issues
          </div>
        ) : (
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
                    canManage={canManage}
                  />
                );
              })}
            </ul>
          </SortableContext>
        )}
      </CardContent>
    </Card>
  );
});

export default KanbanColumn;

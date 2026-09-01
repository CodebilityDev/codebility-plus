"use client";

import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

import { fetchColumnTasksPage } from "@/actions/kanban/queries";
import { KANBAN_COLUMN_TASK_PAGE_SIZE } from "@/lib/kanban/board-pagination";
import {
  useKanbanBoardActions,
  useKanbanBoardStore,
} from "@/store/kanban-board/KanbanBoardProvider";

export function useColumnTasksInfinite(columnId: string) {
  const columnLoadMeta = useKanbanBoardStore(
    (state) => state.columnLoadMeta[columnId],
  );
  const { appendColumnTasksLocal, setColumnLoadMeta } = useKanbanBoardActions();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);

  const loadedCount = columnLoadMeta?.loadedCount ?? 0;
  const totalCount = columnLoadMeta?.totalCount ?? 0;
  const hasMore =
    totalCount > KANBAN_COLUMN_TASK_PAGE_SIZE && loadedCount < totalCount;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) {
      return;
    }

    loadingRef.current = true;
    setIsLoadingMore(true);

    try {
      const result = await fetchColumnTasksPage(
        columnId,
        loadedCount,
        KANBAN_COLUMN_TASK_PAGE_SIZE,
      );

      if (!result.success) {
        toast.error(result.error ?? "Failed to load more tasks");
        return;
      }

      if (result.tasks?.length) {
        appendColumnTasksLocal(columnId, result.tasks);
        return;
      }

      setColumnLoadMeta(columnId, {
        loadedCount,
        totalCount: loadedCount,
      });
    } catch {
      toast.error("Failed to load more tasks");
    } finally {
      loadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [appendColumnTasksLocal, columnId, hasMore, loadedCount, setColumnLoadMeta]);

  return { hasMore, isLoadingMore, loadMore };
}

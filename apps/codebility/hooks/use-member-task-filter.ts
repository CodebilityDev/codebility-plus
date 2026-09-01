"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { fetchMemberBoardTasks } from "@/app/home/kanban/[projectId]/[id]/actions";
import { isBoardFullyLoaded } from "@/lib/kanban/column-load-meta";
import {
  useKanbanBoardActions,
  useKanbanBoardMeta,
  useKanbanBoardStore,
} from "@/store/kanban-board/KanbanBoardProvider";

/**
 * Member filter: client-side when the board is fully loaded, otherwise fetches
 * that member's tasks from the server and merges them into the board store.
 */
export function useMemberTaskFilter() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);
  const { boardId } = useKanbanBoardMeta();
  const columnLoadMeta = useKanbanBoardStore((state) => state.columnLoadMeta);
  const { mergeTasksLocal } = useKanbanBoardActions();

  const hydratedMembersRef = useRef(new Set<string>());
  const requestGenRef = useRef(0);

  useEffect(() => {
    hydratedMembersRef.current.clear();
  }, [boardId]);

  const handleFilterClick = useCallback(
    async (userId: string) => {
      let nextFilter: string | null = null;
      setActiveFilter((previous) => {
        nextFilter = previous === userId ? null : userId;
        return nextFilter;
      });

      if (!nextFilter) {
        return;
      }

      if (
        isBoardFullyLoaded(columnLoadMeta) ||
        hydratedMembersRef.current.has(nextFilter)
      ) {
        return;
      }

      const requestGen = ++requestGenRef.current;
      setLoadingMemberId(nextFilter);

      try {
        const result = await fetchMemberBoardTasks(boardId, nextFilter);

        if (requestGen !== requestGenRef.current) {
          return;
        }

        if (!result.success) {
          toast.error(result.error ?? "Failed to load member tasks");
          return;
        }

        if (result.tasks?.length) {
          mergeTasksLocal(result.tasks);
        }

        hydratedMembersRef.current.add(nextFilter);
      } catch {
        if (requestGen === requestGenRef.current) {
          toast.error("Failed to load member tasks");
        }
      } finally {
        if (requestGen === requestGenRef.current) {
          setLoadingMemberId(null);
        }
      }
    },
    [boardId, columnLoadMeta, mergeTasksLocal],
  );

  return { activeFilter, handleFilterClick, loadingMemberId };
}

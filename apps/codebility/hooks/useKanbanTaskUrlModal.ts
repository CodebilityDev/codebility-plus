"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { KanbanBoardType, KanbanColumnType } from "@/types/home/codev";

/**
 * Syncs the Kanban task modal with the URL ?taskId param.
 */
export function useKanbanTaskUrlModal(
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] }
) {
  const { isOpen, type, onOpen } = useModal();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Flatten all tasks once
  const tasks = useMemo(
    () => boardData.kanban_columns.flatMap((col) => col.tasks ?? []),
    [boardData.kanban_columns]
  );

  // Track whether we've already opened the modal from the URL
  const openedFromUrlRef = useRef(false);

  useEffect(() => {
    const taskId = searchParams.get("taskId");

    // Open modal only once from URL
    if (taskId && !openedFromUrlRef.current) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        onOpen("taskViewModal", task);
        openedFromUrlRef.current = true;
      }
    }

    // Clear URL if modal closed
    if (!isOpen && searchParams.has("taskId")) {
      router.replace(pathname, { scroll: false });
      openedFromUrlRef.current = false; // reset so next URL param works
    }

    // If modal type changes away from taskViewModal, remove param
    if (isOpen && type !== "taskViewModal" && searchParams.has("taskId")) {
      router.replace(pathname, { scroll: false });
      openedFromUrlRef.current = false;
    }
  }, [isOpen, type, tasks, onOpen, pathname, searchParams, router]);
}

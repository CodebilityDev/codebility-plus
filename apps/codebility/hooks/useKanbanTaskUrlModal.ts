"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { KanbanBoardType, KanbanColumnType } from "@/types/home/codev";

/**
 * Syncs the Kanban task modal with the URL ?taskId param.
 * - Opens the modal automatically if taskId exists.
 * - Cleans the URL when the modal closes.
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

  useEffect(() => {
    const taskId = searchParams.get("taskId");

    // Open modal if taskId exists and modal is not already open
    if (taskId && !isOpen) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        onOpen("taskViewModal", task);
      }
    }

    // Close modal → clean URL
    if (!isOpen && searchParams.has("taskId")) {
      router.replace(pathname, { scroll: false });
    }

    // If modal type changes away from taskViewModal, remove param
    if (isOpen && type !== "taskViewModal" && searchParams.has("taskId")) {
      router.replace(pathname, { scroll: false });
    }
  }, [isOpen, type, tasks, onOpen, pathname, searchParams, router]);
}

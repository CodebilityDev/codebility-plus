"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useKanbanModal } from "@/hooks/use-modal-kanban";
import { KanbanBoardType, KanbanColumnType, Task } from "@/types/home/codev";

function buildPathWithTaskId(
  pathname: string,
  currentSearch: string,
  taskId: string | null,
): string {
  const params = new URLSearchParams(currentSearch);

  if (taskId) {
    params.set("taskId", taskId);
  } else {
    params.delete("taskId");
    params.delete("commentId");
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function readTaskIdFromWindow(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("taskId");
}

/**
 * Keeps ?taskId= in sync with the task view modal.
 * Modal store leads for clicks. URL uses history.replaceState so Next.js
 * searchParams (and the Suspense boundary) are not re-triggered per open.
 */
export function useKanbanTaskUrlModal(
  boardData: KanbanBoardType & { kanban_columns: KanbanColumnType[] },
) {
  const { isOpen, type, data, onOpen, onClose } = useKanbanModal();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tasks = useMemo(
    () => boardData.kanban_columns.flatMap((col) => col.tasks ?? []),
    [boardData.kanban_columns],
  );

  const isArchiveView = searchParams.get("view") === "archive";
  const modalTaskId =
    isOpen && type === "taskViewModal" && data
      ? (data as Task).id
      : null;

  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const modalRef = useRef({ isOpen, type, modalTaskId, onOpen, onClose });
  modalRef.current = { isOpen, type, modalTaskId, onOpen, onClose };

  const deepLinkedRef = useRef(false);

  // Deep link on first paint (?taskId= in the loaded URL)
  useEffect(() => {
    if (deepLinkedRef.current || isArchiveView) {
      return;
    }

    const taskId = readTaskIdFromWindow();
    if (!taskId) {
      return;
    }

    deepLinkedRef.current = true;

    const task = tasksRef.current.find((t) => t.id === taskId);
    if (task) {
      onOpen("taskViewModal", task);
    }
  }, [isArchiveView, onOpen]);

  // Modal → URL (sync; no router.replace)
  useLayoutEffect(() => {
    if (isArchiveView) {
      return;
    }

    const currentSearch = window.location.search;
    const urlTaskId = readTaskIdFromWindow();

    if (type === "taskViewModal" && isOpen && modalTaskId) {
      if (urlTaskId !== modalTaskId) {
        const next = buildPathWithTaskId(pathname, currentSearch, modalTaskId);
        window.history.replaceState(window.history.state, "", next);
      }
      return;
    }

    if (!isOpen && urlTaskId) {
      const next = buildPathWithTaskId(pathname, currentSearch, null);
      window.history.replaceState(window.history.state, "", next);
    }
  }, [isOpen, type, modalTaskId, isArchiveView, pathname]);

  // Back/forward only (replaceState does not fire popstate)
  useEffect(() => {
    if (isArchiveView) {
      return;
    }

    const onPopState = () => {
      const taskId = readTaskIdFromWindow();
      const { isOpen, type, modalTaskId, onOpen, onClose } = modalRef.current;

      if (!taskId) {
        if (isOpen && type === "taskViewModal") {
          onClose();
        }
        return;
      }

      if (modalTaskId === taskId) {
        return;
      }

      const task = tasksRef.current.find((t) => t.id === taskId);
      if (task) {
        onOpen("taskViewModal", task);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isArchiveView]);
}

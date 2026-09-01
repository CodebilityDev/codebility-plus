"use client";

import { ReactNode, memo, useCallback } from "react";

import { useKanbanModal } from "@/hooks/kanban/use-modal-kanban";
import { ExtendedTask } from "@/types/home/codev";

interface Props {
  children: ReactNode;
  task: ExtendedTask;
  onComplete?: (taskId: string) => void;
}

function KanbanTaskViewEditModal({
  children,
  task,
  onComplete,
}: Props) {
  const { onOpen } = useKanbanModal();

  const handleClick = useCallback(() => {
    onOpen("taskViewModal", task, onComplete as (taskId?: string) => void);
  }, [onOpen, task, onComplete]);

  return <div onClick={handleClick}>{children}</div>;
}

export default memo(KanbanTaskViewEditModal);

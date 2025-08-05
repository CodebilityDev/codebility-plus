"use client";

import { ReactNode, memo, useCallback } from "react";
import { useModal } from "@/hooks/use-modal";
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
  const { onOpen } = useModal();

  const handleClick = useCallback(() => {
    onOpen("taskViewModal", task, onComplete);
  }, [onOpen, task, onComplete]);

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
}

export default memo(KanbanTaskViewEditModal);

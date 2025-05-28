"use client";

import { ReactNode } from "react";
import { useModal } from "@/hooks/use-modal";
import { ExtendedTask } from "@/types/home/codev";

interface Props {
  children: ReactNode;
  task: ExtendedTask;
  onComplete?: (taskId: string) => void;
}

export default function KanbanTaskViewEditModal({
  children,
  task,
  onComplete,
}: Props) {
  const { onOpen } = useModal();

  return (
    <div onClick={() => onOpen("taskViewModal", task, onComplete)}>
      {children}
    </div>
  );
}

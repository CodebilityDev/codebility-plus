"use client";

import { ReactNode } from "react";
import { useModal } from "@/hooks/use-modal";
import { Task } from "@/types/home/task";

interface Props {
  children: ReactNode;
  task: Task;
}

export default function KanbanTaskViewEditModal({ children, task }: Props) {
  const { onOpen } = useModal();

  return <div onClick={() => onOpen("taskViewModal", task)}>{children}</div>;
}

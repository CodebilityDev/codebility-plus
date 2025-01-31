"use client";

import { ReactNode } from "react";
import { useModal } from "@/hooks/use-modal";
import { ExtendedTask } from "@/types/home/codev";

interface Props {
  children: ReactNode;
  task: ExtendedTask;
}

export default function KanbanTaskViewEditModal({ children, task }: Props) {
  const { onOpen } = useModal();

  return <div onClick={() => onOpen("taskViewModal", task)}>{children}</div>;
}

"use client";

import { useModal } from "@/hooks/use-modal";

interface Props {
  listId: string;
  listName: string;
  projectId: string;
  totalTask: number;
}

export default function KanbanTaskAddModal({
  listId,
  listName,
  projectId,
  totalTask,
}: Props) {
  const { onOpen } = useModal();

  const data = {
    listId,
    listName,
    projectId,
    totalTask,
  };

  return (
    <button
      type="button"
      className="hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm flex w-full items-center gap-2 rounded-md px-2 text-white dark:text-white border border-white/20 dark:border-white/10 transition-all duration-200"
      onClick={() => onOpen("taskAddModal", data)}
    >
      <p className="text-2xl">+</p>
      <p>Add a card</p>
    </button>
  );
}

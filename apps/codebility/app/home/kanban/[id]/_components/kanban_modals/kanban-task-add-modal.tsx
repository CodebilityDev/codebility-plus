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
      className="hover:bg-black-400/40 flex w-full items-center gap-2 rounded-md px-2"
      onClick={() => onOpen("taskAddModal", data)}
    >
      <p className="text-2xl">+</p>
      <p>Add a card</p>
    </button>
  );
}

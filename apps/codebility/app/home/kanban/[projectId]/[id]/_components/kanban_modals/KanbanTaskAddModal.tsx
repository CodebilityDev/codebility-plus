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
      className="flex w-full items-center gap-2 rounded-md border px-2 backdrop-blur-sm transition-all duration-200 border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
      onClick={() => onOpen("taskAddModal", data)}
    >
      <p className="text-2xl">+</p>
      <p>Add a card</p>
    </button>
  );
}
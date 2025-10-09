"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { IconAdd } from "@/public/assets/svgs";

interface KanbanColumnAddButtonProps {
  boardId: string;
}

export default function KanbanColumnAddButton({
  boardId,
}: KanbanColumnAddButtonProps) {
  const { onOpen } = useModal();

  return (
    <Button
      variant="default"
      className="flex w-full sm:w-max items-center justify-center gap-2 text-sm md:text-base px-3 py-2"
      onClick={() => onOpen("ColumnAddModal", boardId)}
    >
      <IconAdd />
      <p>Add column</p>
    </Button>
  );
}

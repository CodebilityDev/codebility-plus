"use client";

import { Button } from "@/Components/ui/button";
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
      className="flex w-max items-center gap-2"
      onClick={() => onOpen("ColumnAddModal", boardId)}
    >
      <IconAdd />
      <p>Add column</p>
    </Button>
  );
}

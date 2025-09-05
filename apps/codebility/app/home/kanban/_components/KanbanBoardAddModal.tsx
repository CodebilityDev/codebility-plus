"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { IconAdd } from "@/public/assets/svgs";

export default function KanbanBoardAddModal() {
  const { onOpen } = useModal();

  return (
    <Button
      variant="default"
      className="flex w-max items-center gap-2"
      onClick={() => onOpen("boardAddModal")}
    >
      <IconAdd />
      <p>Add new board</p>
    </Button>
  );
}

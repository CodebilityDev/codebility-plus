"use client";

import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { IconAdd } from "@/public/assets/svgs";

export default function KanbanListAddModal({ boardId }: { boardId: string }) {
  const { onOpen } = useModal();

  return (
    <Button
      variant="default"
      className="flex w-max items-center gap-2"
      onClick={() => onOpen("listAddModal", boardId)}
    >
      <IconAdd />
      <p>Add new list</p>
    </Button>
  );
}

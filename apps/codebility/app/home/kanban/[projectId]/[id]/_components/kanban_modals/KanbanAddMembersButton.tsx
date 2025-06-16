"use client";

import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-projects";
import { IconAdd } from "@/public/assets/svgs";

export default function KanbanAddMembersButton() {
  const { onOpen } = useModal();

  return (
    <Button
      variant="default"
      className="flex w-max items-center gap-2 text-sm md:text-base"
      onClick={() => onOpen("KanbanAddMembersModal")}
    >
      <IconAdd />
      <p>Add Members</p>
    </Button>
  );
}
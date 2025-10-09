"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-projects";
import { IconAdd } from "@/public/assets/svgs";

export default function KanbanAddMembersButton() {
  const { onOpen } = useModal();

  return (
    <Button
      variant="default"
      className="flex w-full sm:w-max items-center justify-center gap-2 text-sm md:text-base px-3 py-2"
      onClick={() => onOpen("KanbanAddMembersModal")}
    >
      <IconAdd />
      <p>Add Members</p>
    </Button>
  );
}
"use client";

import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-projects";

export default function InsertButton() {
  const { onOpen } = useModal();

  return (
    <>
      <Button
        variant="default"
        className="items-center"
        onClick={() => onOpen("projectAddModal")}
      >
        Add New Project
      </Button>
    </>
  );
}

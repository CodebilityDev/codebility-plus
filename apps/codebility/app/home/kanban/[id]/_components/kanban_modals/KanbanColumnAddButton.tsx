"use client";

import React from "react";
import Image from "next/image";
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
      <Image src={IconAdd} width={16} height={16} alt="Add icon" />
      <p>Add column</p>
    </Button>
  );
}

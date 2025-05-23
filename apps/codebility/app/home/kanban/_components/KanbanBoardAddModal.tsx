"use client";

import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { IconAdd } from "@/public/assets/svgs";
import Image from "next/image";
import React from "react";

export default function KanbanBoardAddModal() {
  const { onOpen } = useModal();

  return (
    <Button
      variant="default"
      className="flex w-max items-center gap-2"
      onClick={() => onOpen("boardAddModal")}
    >
      <Image src={IconAdd} width={16} height={16} alt="Add icon" />
      <p>Add new board</p>
    </Button>
  );
}

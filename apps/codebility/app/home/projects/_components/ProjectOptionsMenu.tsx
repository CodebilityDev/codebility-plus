import React, { useState } from "react";
import SwitchStatusButton from "../components/ui/SwitchStatusButton";
import { ChevronDown, SquareChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Select } from "@codevs/ui/select";

import {
  updateKanbanDisplaySwitch,
  updatePublicDisplaySwitch,
  updateStatus,
} from "../actions";
import { ProjectCardProps } from "./ProjectCard";

export default function ProjectOptionsMenu({
  project,
  onOpen,
  categoryId,
}: ProjectCardProps) {
  const [kanbanDisplay, setKanbanDisplay] = useState<boolean>(
    project.kanban_display,
  );
/*   const [publicDisplay, setPublicDisplay] = useState<boolean>(
    project.public_display,
  ); */

  const [loading, setLoading] = useState<boolean>(false);

  const handleKanbanDisplay = async (e: React.MouseEvent): Promise<void> => {
    setLoading(true);
    const { id } = e.currentTarget;
    e.stopPropagation();
    try {
      setKanbanDisplay(!kanbanDisplay);
      await updateKanbanDisplaySwitch(!kanbanDisplay, id);
    } catch (error) {
      console.error("Error updating kanban display:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <SwitchStatusButton
        disabled={loading}
        handleSwitch={handleKanbanDisplay}
        isActive={kanbanDisplay}
        id={project.id}
      />
    </>
    /*   <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ChevronDown className="text-black-100 size-6 dark:text-white " />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-black-200 w-56 bg-white">
        <DropdownMenuItem className="flex cursor-default items-center justify-between px-3 py-2 focus:bg-transparent">
          <span className="text-sm font-medium">Kanban Display</span>
         
        </DropdownMenuItem>

        <DropdownMenuItem className="flex cursor-default items-center justify-between px-3 py-2 focus:bg-transparent">
          <span className="text-sm font-medium">Public Display</span>
          <SwitchStatusButton
            disabled={loading}
            handleSwitch={handlePublicDisplay}
            isActive={publicDisplay}
            id={project.id}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> */
  );
}

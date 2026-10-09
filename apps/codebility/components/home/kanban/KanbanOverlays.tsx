"use client";

import { ModalSlot } from "@/components/global/modals/ModalSlot";
import SprintCreateDrawer from "@/components/home/kanban/SprintCreateDrawer";

export default function KanbanOverlays() {
  return (
    <ModalSlot type="sprintCreateDrawer">
      <SprintCreateDrawer />
    </ModalSlot>
  );
}

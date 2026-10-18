"use client";

import { ModalSlot } from "@/components/global/modals/ModalSlot";
import SprintCreateDrawer from "@/components/home/kanban/SprintCreateDrawer";
import TaskCreateDrawer from "@/components/home/kanban/TaskCreateDrawer";

export default function KanbanOverlays({ canManage }: { canManage: boolean }) {
  return (
    <>
      <ModalSlot type="sprintCreateDrawer">
        <SprintCreateDrawer />
      </ModalSlot>
      <ModalSlot type="taskCreateDrawer">
        <TaskCreateDrawer canManage={canManage} />
      </ModalSlot>
    </>
  );
}

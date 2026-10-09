"use client";

import OverlayTrigger from "@/components/global/OverlayTrigger";

export default function KanbanSprintCreateButton({
  projectId,
  canCreate,
}: {
  projectId: string;
  canCreate: boolean;
}) {
  if (!canCreate) return null;

  return (
    <OverlayTrigger type="sprintCreateDrawer" data={{ projectId, canCreate }}>
      New sprint
    </OverlayTrigger>
  );
}

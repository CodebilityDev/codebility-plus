"use client";

import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-sprints";
import { useUserStore } from "@/store/codev-store";

interface AddSprintButtonProps {
  projectId: string;
}

export default function AddSprintButton({ projectId }: AddSprintButtonProps) {
  const { onOpen } = useModal();

  const { user } = useUserStore();
  const canAddSprints =
    user?.role_id === 1 ||
    user?.role_id === 2 ||
    user?.role_id === 3 ||
    user?.role_id === 5 ||
    user?.role_id === 4; // FIXME: Temporary role for intern

  return (
    <>
      {canAddSprints && (
        <Button
          variant="default"
          className="items-center w-fit"
          onClick={() => onOpen("sprintAddModal", projectId)}
        >
          Add Sprint
        </Button>
      )}
    </>
  );
}

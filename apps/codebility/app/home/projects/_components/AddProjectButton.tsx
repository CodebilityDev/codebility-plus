"use client";

import { Button } from "../components/ui/button";
import { useModal } from "@/hooks/use-modal-projects";
import { useUserStore } from "@/store/codev-store";

export default function AddProjectButton() {
  const { onOpen } = useModal();

  const { user } = useUserStore();
  const canAddProjects =
    user?.role_id === 1 ||
    user?.role_id === 2 ||
    user?.role_id === 3 ||
    user?.role_id === 5;

  return (
    <>
      {canAddProjects && (
        <Button
          variant="default"
          className="items-center"
          onClick={() => onOpen("projectAddModal")}
        >
          Add New Project
        </Button>
      )}
    </>
  );
}

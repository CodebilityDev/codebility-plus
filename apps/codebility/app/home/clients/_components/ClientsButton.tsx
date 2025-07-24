"use client";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-clients";
import { useUserStore } from "@/store/codev-store";

export default function ClientButtons() {
  const { onOpen } = useModal();
  const { user } = useUserStore();
  const canAddClients =
    user?.role_id === 1 ||
    user?.role_id === 2 ||
    user?.role_id === 3 ||
    user?.role_id === 5;

  return (
    <>
      {/* You can add more buttons or links here if needed */}
      {canAddClients && (
        <Button
          variant="default"
          onClick={() => onOpen("clientAddModal")}
        >
          Add New Client
        </Button>
      )}
    </>
  );
}

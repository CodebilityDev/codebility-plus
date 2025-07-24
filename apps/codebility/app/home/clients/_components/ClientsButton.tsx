"use client";

import { Button } from "../components/ui/button";
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
    <div className="flex flex-col-reverse gap-4 md:w-96 md:flex-row">
      {/* You can add more buttons or links here if needed */}
      {canAddClients && (
        <Button
          variant="default"
          className="md:w-1/2"
          onClick={() => onOpen("clientAddModal")}
        >
          Add New Client
        </Button>
      )}
    </div>
  );
}

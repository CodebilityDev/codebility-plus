"use client";

import AddNewButton from "@/components/ui/AddNewButton";
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
      {canAddClients && (
        <AddNewButton
          onClick={() => onOpen("clientAddModal")}
          label="Add New Client"
        />
      )}
    </>
  );
}

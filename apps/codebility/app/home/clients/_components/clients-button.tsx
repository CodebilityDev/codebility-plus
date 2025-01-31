"use client";

import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-clients";

export default function ClientButtons() {
  const { onOpen } = useModal();

  return (
    <div className="flex flex-col-reverse gap-4 md:w-96 md:flex-row">
      {/* You can add more buttons or links here if needed */}
      <Button
        variant="default"
        className="md:w-1/2"
        onClick={() => onOpen("clientAddModal")}
      >
        Add New Client
      </Button>
    </div>
  );
}

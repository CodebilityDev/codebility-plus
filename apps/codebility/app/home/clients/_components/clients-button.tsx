"use client";

import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-clients";

const ClientButtons = () => {
  const { onOpen } = useModal();

  return (
    <div className="flex flex-col-reverse gap-4 md:w-96 md:flex-row">
      <Link href="/home/clients/archive" className="md:w-1/2">
        <Button variant="link">Archive</Button>
      </Link>
      <Button
        variant="default"
        className="md:w-1/2"
        onClick={() => onOpen("clientAddModal")}
      >
        Add New Client
      </Button>
    </div>
  );
};

export default ClientButtons;

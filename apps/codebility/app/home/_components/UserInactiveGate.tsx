"use client";

import { useState } from "react";
import UserInactiveModal from "@/components/modals/UserInactiveModal";

/**
 * Rendered only when the server already determined the user is inactive, so it
 * just owns the open/closed state of the dialog.
 */
export default function UserInactiveGate() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <UserInactiveModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
  );
}

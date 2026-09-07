"use client";

import { ReactNode } from "react";
import { useModal } from "@/hooks/modals/use-modal";

interface Props {
  projectId: string;
  children: ReactNode;
}

/**
 * Membership and active status are already guaranteed by the query that built
 * the project list, so this no longer re-verifies either on the client.
 */
export default function DashboardCurrentProjectButton({
  projectId,
  children,
}: Props) {
  const { onOpen } = useModal();

  return (
    <button
      type="button"
      onClick={() => onOpen("dashboardCurrentProjectModal", { projectId })}
      className="w-full cursor-pointer transition-opacity"
    >
      {children}
    </button>
  );
}

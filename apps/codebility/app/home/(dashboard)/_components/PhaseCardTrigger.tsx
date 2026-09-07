"use client";

import { ReactNode, useState } from "react";

import { PhaseDetailsModal } from "./PhaseDetailsModal";

/**
 * Makes one roadmap phase card clickable. Each card owns its own dialog so the
 * surrounding roadmap can stay a server component.
 */
export default function PhaseCardTrigger({
  phaseId,
  className,
  children,
}: {
  phaseId: string;
  className?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={className}
      >
        {children}
      </div>
      <PhaseDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        phaseId={phaseId}
      />
    </>
  );
}

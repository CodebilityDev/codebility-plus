import { BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export interface VerifiedBadgeProps {
  label?: ReactNode;
  className?: string;
}

function VerifiedBadge({ label = "Verified", className }: VerifiedBadgeProps) {
  return (
    <span className={cn("inline-flex h-6 items-center gap-2", className)}>
      <BadgeCheck aria-hidden className="h-4 w-4 shrink-0 text-[#02ffe2]" />
      <span className="text-sm text-[#02ffe2]">{label}</span>
    </span>
  );
}

export { VerifiedBadge };

import { BadgeCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export interface VerifiedBadgeProps {
  label?: ReactNode;
  className?: string;
}

function VerifiedBadge({ label = "Verified", className }: VerifiedBadgeProps) {
  return (
    <span className={cn("inline-flex h-[var(--cb-size-24)] items-center gap-[var(--cb-space-8)]", className)}>
      <BadgeCheck aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 text-[color:var(--cb-text-muted)]" />
      <span className="text-sm text-[color:var(--cb-text-muted)]">{label}</span>
    </span>
  );
}

export { VerifiedBadge };

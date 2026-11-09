import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type EyebrowVariant = "solid" | "outline";

export interface EyebrowProps {
  children: ReactNode;
  variant?: EyebrowVariant;
  className?: string;
}

function Eyebrow({ children, variant = "solid", className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[var(--cb-size-28)] w-fit items-center justify-center rounded-[var(--cb-radius-full)] border px-[var(--cb-space-16)] text-xs font-semibold uppercase leading-[18px] text-[color:var(--cb-pill-text)]",
        variant === "outline"
          ? "border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)]"
          : "border-[color:var(--cb-primary)] bg-[color:var(--cb-primary)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Eyebrow };

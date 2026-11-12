import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type TechTagTone = "blue" | "purple" | "teal" | "pink" | "neutral";

export interface TechTagProps {
  children: ReactNode;
  tone?: TechTagTone;
  className?: string;
}

const toneClasses: Record<TechTagTone, string> = {
  blue: "border-[color:var(--cb-role-codev-border)] bg-[color:color-mix(in_srgb,var(--cb-blue)_10%,transparent)] text-[color:var(--cb-role-codev-text)]",
  purple:
    "border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] text-[color:var(--cb-p300)]",
  teal: "border-[color:var(--cb-role-admin-border)] bg-[color:var(--cb-role-admin-bg)] text-[color:var(--cb-role-admin-text)]",
  pink: "border-[color:color-mix(in_srgb,var(--cb-pink)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-pink)_10%,transparent)] text-[color:var(--cb-pink)]",
  neutral:
    "border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] text-[color:var(--cb-text-secondary)]",
};

function TechTag({ children, tone = "blue", className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[var(--cb-size-24)] items-center justify-center rounded-[var(--cb-radius-full)] border px-[var(--cb-space-8)] text-[11px] font-medium leading-4",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { TechTag };

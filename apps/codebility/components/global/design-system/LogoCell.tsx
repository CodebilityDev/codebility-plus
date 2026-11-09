import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type LogoCellVariant = "default" | "accent";

const variantClasses: Record<LogoCellVariant, string> = {
  default: "bg-[color:var(--cb-panel)]",
  accent:
    "bg-[color:var(--cb-panel)] transition-colors duration-300 ease-out hover:bg-[color:var(--cb-primary)]",
};

export interface LogoCellProps {
  children: ReactNode;
  variant?: LogoCellVariant;
  className?: string;
}

function LogoCell({ children, variant = "default", className }: LogoCellProps) {
  return (
    <div
      className={cn(
        "group flex h-[114px] w-[var(--cb-size-200)] items-center justify-center",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

export { LogoCell };

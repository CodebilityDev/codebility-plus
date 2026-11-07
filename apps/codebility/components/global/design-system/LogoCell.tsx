import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type LogoCellVariant = "default" | "accent";

const variantClasses: Record<LogoCellVariant, string> = {
  default: "bg-white/[0.02]",
  accent: "bg-[#9747ff]",
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
        "flex h-24 w-[200px] items-center justify-center border border-white/10",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </div>
  );
}

export { LogoCell };

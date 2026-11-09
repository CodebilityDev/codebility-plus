import * as React from "react";

import { cn } from "@codevs/ui";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  size?: "sm" | "md";
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    { className, selected = false, size = "md", type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center justify-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-[color:var(--cb-bg)] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-[var(--cb-size-28)] px-2.5 text-xs" : "h-[var(--cb-size-32)] px-[var(--cb-space-12)] text-sm",
        selected
          ? "border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] text-[color:var(--cb-pill-text)] hover:bg-[color:color-mix(in_srgb,var(--cb-primary)_16%,transparent)]"
          : "border-[color:var(--cb-border-solid)] bg-[color:var(--cb-surface-solid)] text-[color:var(--cb-text-secondary)] hover:bg-[color:var(--cb-surface-raised)]",
        className,
      )}
      {...props}
    />
  ),
);

Chip.displayName = "Chip";

export { Chip };

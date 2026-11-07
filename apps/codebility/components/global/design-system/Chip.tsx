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
        "inline-flex items-center justify-center gap-2 rounded-full border font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3 text-sm",
        selected
          ? "border-purple-400 bg-[#9747ff] text-purple-100"
          : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/10",
        className,
      )}
      {...props}
    />
  ),
);

Chip.displayName = "Chip";

export { Chip };

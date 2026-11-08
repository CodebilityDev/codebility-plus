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
        "inline-flex h-7 w-fit items-center justify-center rounded-full border px-4 text-xs font-semibold uppercase leading-[18px] text-purple-100",
        variant === "outline"
          ? "border-purple-400/40 bg-[#9747ff]/10"
          : "border-purple-300/50 bg-[#9747ff]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Eyebrow };

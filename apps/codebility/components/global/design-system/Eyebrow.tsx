import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 w-fit items-center justify-center rounded-full border border-purple-300/50 bg-[#9747ff] px-4 text-xs font-semibold uppercase leading-[18px] text-purple-100",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Eyebrow };

import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export interface TechTagProps {
  children: ReactNode;
  className?: string;
}

function TechTag({ children, className }: TechTagProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2 text-[11px] font-medium leading-4 text-blue-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

export { TechTag };

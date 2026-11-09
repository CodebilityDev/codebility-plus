import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export interface LandingContainerProps {
  className?: string;
  children: ReactNode;
}

function LandingContainer({ className, children }: LandingContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px] px-[var(--cb-space-20)] sm:px-[var(--cb-space-32)] lg:px-[var(--cb-space-80)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { LandingContainer };

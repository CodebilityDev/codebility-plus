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
        "mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-20",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { LandingContainer };

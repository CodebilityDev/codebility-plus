import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export function HireContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
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

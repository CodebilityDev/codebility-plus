import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export function ProfileSectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { IconTile } from "@/components/global/design-system/IconTile";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[238px] flex-col gap-[var(--cb-space-16)] rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-24)]",
        className,
      )}
    >
      <IconTile className="[&>svg]:h-[var(--cb-size-18)] [&>svg]:w-[var(--cb-size-18)]">{icon}</IconTile>
      <h3 className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
        {title}
      </h3>
      <p className="text-sm leading-5 text-[color:var(--cb-text-muted)]">{description}</p>
    </div>
  );
}

export { FeatureCard };

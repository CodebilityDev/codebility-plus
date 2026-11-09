import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { IconTile } from "@/components/global/design-system/IconTile";

export interface MetricCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  description: string;
  className?: string;
}

function MetricCard({
  icon,
  value,
  label,
  description,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "flex h-[200px] flex-col rounded-[20px] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-24)]",
        className,
      )}
    >
      <div className="flex items-center gap-[var(--cb-space-12)]">
        <IconTile
          variant="glass"
          className="h-[var(--cb-size-44)] w-[var(--cb-size-44)] shrink-0 [&>svg]:h-[var(--cb-size-16)] [&>svg]:w-[var(--cb-size-16)]"
        >
          {icon}
        </IconTile>
        <p className="cb-metric-text text-[48px] font-bold leading-[48px] tracking-[-0.03em]">
          {value}
        </p>
      </div>
      <p className="mt-[var(--cb-space-28)] text-lg font-semibold leading-6 text-[color:var(--cb-text)]">
        {label}
      </p>
      <p className="mt-[var(--cb-space-8)] text-sm leading-5 tracking-[-0.01em] text-[color:var(--cb-text-muted)]">
        {description}
      </p>
    </div>
  );
}

export { MetricCard };

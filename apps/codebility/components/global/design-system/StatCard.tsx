import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { IconTile } from "@/components/global/design-system/IconTile";

export interface StatCardProps {
  value: string | number;
  label: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

function StatCard({
  value,
  label,
  description,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex h-[300px] flex-col gap-[var(--cb-space-16)] rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-24)]",
        className,
      )}
    >
      <div className="flex items-center gap-[var(--cb-space-12)]">
        {icon ? (
          <IconTile
            variant="glass"
            className="[&>svg]:h-[var(--cb-size-18)] [&>svg]:w-[var(--cb-size-18)]"
          >
            {icon}
          </IconTile>
        ) : null}
        <p className="bg-gradient-to-b from-[var(--cb-p400)] to-[var(--cb-cyan)] bg-clip-text text-5xl font-bold leading-[48px] text-transparent">
          {value}
        </p>
      </div>
      <p className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
        {label}
      </p>
      <p className="text-sm leading-5 text-[color:var(--cb-text-muted)]">{description}</p>
    </div>
  );
}

export { StatCard };

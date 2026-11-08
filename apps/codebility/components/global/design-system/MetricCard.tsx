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
        "flex min-h-[120px] items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5",
        className,
      )}
    >
      <IconTile
        variant="glass"
        className="h-10 w-10 shrink-0 [&>svg]:h-4 [&>svg]:w-4"
      >
        {icon}
      </IconTile>
      <div className="min-w-0">
        <p className="bg-gradient-to-b from-purple-400 to-cyan-400 bg-clip-text text-[40px] font-bold leading-[44px] text-transparent">
          {value}
        </p>
        <p className="text-sm font-semibold leading-5 text-[#f4f4f4]">
          {label}
        </p>
        <p className="text-xs leading-[18px] text-white/50">{description}</p>
      </div>
    </div>
  );
}

export { MetricCard };

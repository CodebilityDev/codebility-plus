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
        "flex h-[300px] flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <IconTile
            variant="glass"
            className="[&>svg]:h-[18px] [&>svg]:w-[18px]"
          >
            {icon}
          </IconTile>
        ) : null}
        <p className="bg-gradient-to-b from-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold leading-[48px] text-transparent">
          {value}
        </p>
      </div>
      <p className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
        {label}
      </p>
      <p className="text-sm leading-5 text-white/60">{description}</p>
    </div>
  );
}

export { StatCard };

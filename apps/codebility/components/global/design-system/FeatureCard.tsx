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
        "flex min-h-[238px] flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6",
        className,
      )}
    >
      <IconTile className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</IconTile>
      <h3 className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
        {title}
      </h3>
      <p className="text-sm leading-5 text-white/60">{description}</p>
    </div>
  );
}

export { FeatureCard };

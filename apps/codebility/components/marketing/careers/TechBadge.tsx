"use client";
import type { TechBadgeProps } from "@/types/marketing/careers/careers";

export const TechBadge = ({ name, className }: TechBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-all hover:opacity-90 ${className}`}
    >
      {name}
    </span>
  );
};

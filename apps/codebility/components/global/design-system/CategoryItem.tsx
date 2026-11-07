import { ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@codevs/ui";

export interface CategoryItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
}

const CategoryItem = React.forwardRef<HTMLButtonElement, CategoryItemProps>(
  (
    {
      className,
      icon,
      label,
      count,
      active = false,
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={active}
      className={cn(
        "flex h-12 w-full items-center gap-2 rounded-xl border px-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] disabled:pointer-events-none disabled:opacity-50",
        active
          ? "border-[#9747ff]/50 bg-[#9747ff]/[0.18] text-[#f4f4f4]"
          : "border-white/10 bg-white/[0.02] text-[#f4f4f4] hover:border-white/20",
        className,
      )}
      {...props}
    >
      {icon === undefined ? null : (
        <span
          aria-hidden
          className={cn(
            "flex h-[18px] w-[18px] shrink-0 items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]",
            active ? "text-purple-200" : "text-white/60",
          )}
        >
          {icon}
        </span>
      )}
      <span className="text-[15px] leading-5">{label}</span>
      {count === undefined ? null : (
        <span className="text-xs text-white/50">{count}</span>
      )}
      <ChevronRight className="ml-auto h-[18px] w-[18px] shrink-0 text-white/50" />
    </button>
  ),
);

CategoryItem.displayName = "CategoryItem";

export { CategoryItem };

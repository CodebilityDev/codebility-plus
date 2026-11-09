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
        "flex h-[var(--cb-size-48)] w-full items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-12)] border px-[var(--cb-space-16)] text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] disabled:pointer-events-none disabled:opacity-50",
        active
          ? "border-[color:color-mix(in_srgb,var(--cb-primary)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_18%,transparent)] text-[color:var(--cb-text)]"
          : "border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] text-[color:var(--cb-text)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)]",
        className,
      )}
      {...props}
    >
      {icon === undefined ? null : (
        <span
          aria-hidden
          className={cn(
            "flex h-[var(--cb-size-18)] w-[var(--cb-size-18)] shrink-0 items-center justify-center [&>svg]:h-[var(--cb-size-18)] [&>svg]:w-[var(--cb-size-18)]",
            active ? "text-[color:var(--cb-p200)]" : "text-[color:var(--cb-text-muted)]",
          )}
        >
          {icon}
        </span>
      )}
      <span className="text-[15px] leading-5">{label}</span>
      {count === undefined ? null : (
        <span className="text-xs text-[color:var(--cb-text-muted)]">{count}</span>
      )}
      <ChevronRight className="ml-auto h-[var(--cb-size-18)] w-[var(--cb-size-18)] shrink-0 text-[color:var(--cb-text-muted)]" />
    </button>
  ),
);

CategoryItem.displayName = "CategoryItem";

export { CategoryItem };

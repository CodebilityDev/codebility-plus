import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type IconTileVariant = "primary" | "glass" | "tint";
export type IconTileShape = "square" | "circle";

const variantClasses: Record<IconTileVariant, string> = {
  primary: "border-[color:color-mix(in_srgb,var(--cb-p400)_40%,transparent)] bg-[color:var(--cb-primary)] text-[color:var(--cb-text)]",
  glass: "border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] text-[color:var(--cb-text-secondary)]",
  tint: "border-[color:var(--cb-pill-border)] bg-[color:var(--cb-pill-bg)] text-[color:var(--cb-p200)]",
};

export interface IconTileProps {
  children: ReactNode;
  variant?: IconTileVariant;
  shape?: IconTileShape;
  className?: string;
}

function IconTile({
  children,
  variant = "primary",
  shape = "square",
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        "flex h-[var(--cb-size-44)] w-[var(--cb-size-44)] shrink-0 items-center justify-center border",
        shape === "circle" ? "rounded-[var(--cb-radius-full)]" : "rounded-[var(--cb-radius-12)]",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { IconTile };

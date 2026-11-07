import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

export type IconTileVariant = "primary" | "glass";
export type IconTileShape = "square" | "circle";

const variantClasses: Record<IconTileVariant, string> = {
  primary: "border-purple-400/40 bg-[#9747ff] text-white",
  glass: "border-white/10 bg-white/5 text-white/70",
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
        "flex h-11 w-11 shrink-0 items-center justify-center border",
        shape === "circle" ? "rounded-full" : "rounded-xl",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { IconTile };

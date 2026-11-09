import Image from "next/image";
import * as React from "react";

import { cn } from "@codevs/ui";

export type AvatarGradient = "violet" | "teal" | "cyan";
export type AvatarSize = 32 | 40 | 48 | 56 | 72;

const sizeClasses: Record<AvatarSize, string> = {
  32: "h-[var(--cb-size-32)] w-[var(--cb-size-32)] text-xs",
  40: "h-[var(--cb-size-40)] w-[var(--cb-size-40)] text-xs",
  48: "h-[var(--cb-size-48)] w-[var(--cb-size-48)] text-sm",
  56: "h-[var(--cb-size-56)] w-[var(--cb-size-56)] text-[17px]",
  72: "h-[var(--cb-size-72)] w-[var(--cb-size-72)] text-[17px]",
};

const gradientClasses: Record<AvatarGradient, string> = {
  violet: "from-[var(--cb-primary)] to-[var(--cb-mentor-end)]",
  teal: "from-[var(--cb-brand-start)] to-[var(--cb-brand-mid)]",
  cyan: "from-[var(--cb-brand-mid)] to-[var(--cb-teal)]",
};

export interface AvatarProps {
  initials: string;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  gradient?: AvatarGradient;
  online?: boolean;
  className?: string;
}

function Avatar({
  initials,
  src,
  alt,
  size = 40,
  gradient = "violet",
  online = false,
  className,
}: AvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        role={src ? undefined : "img"}
        aria-label={src ? undefined : (alt ?? initials)}
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-[var(--cb-radius-full)] bg-gradient-to-b font-semibold text-[color:var(--cb-text)]",
          sizeClasses[size],
          gradientClasses[gradient],
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? initials}
            width={size}
            height={size}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>{initials}</span>
        )}
      </span>
      {online ? (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 right-0 rounded-[var(--cb-radius-full)] border-2 border-[color:var(--cb-bg)] bg-[color:var(--cb-success)]",
            size === 32 ? "h-[var(--cb-size-10)] w-[var(--cb-size-10)]" : "h-[var(--cb-size-12)] w-[var(--cb-size-12)]",
          )}
        />
      ) : null}
    </span>
  );
}

export { Avatar };

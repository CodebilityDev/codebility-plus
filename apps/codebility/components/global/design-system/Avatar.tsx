import Image from "next/image";
import * as React from "react";

import { cn } from "@codevs/ui";

export type AvatarGradient = "violet" | "teal" | "cyan";
export type AvatarSize = 32 | 40 | 56 | 72;

const sizeClasses: Record<AvatarSize, string> = {
  32: "h-8 w-8 text-xs",
  40: "h-10 w-10 text-xs",
  56: "h-14 w-14 text-[17px]",
  72: "h-[72px] w-[72px] text-[17px]",
};

const gradientClasses: Record<AvatarGradient, string> = {
  violet: "from-[#9747ff] to-[#c108fe]",
  teal: "from-[#00738b] to-[#0a3b9d]",
  cyan: "from-[#0c3fdb] to-[#02ffe2]",
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
          "flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-b font-semibold text-white",
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
            "absolute bottom-0 right-0 rounded-full border-2 border-[#030303] bg-[#4bce97]",
            size === 32 ? "h-2.5 w-2.5" : "h-3 w-3",
          )}
        />
      ) : null}
    </span>
  );
}

export { Avatar };

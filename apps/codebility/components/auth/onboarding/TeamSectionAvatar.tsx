"use client";

import { cn } from "@/utils/global/cn";
import type { TeamSectionAvatarProps } from "@/types/auth/onboarding/onboarding";

export function TeamSectionAvatar({
  person,
  size = 72,
  position = "center top"
}: TeamSectionAvatarProps) {
  const initials = (person.name || "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();

  return person.image ? (
    <div
      className="rounded-full shadow-md ring-2 ring-white/20 overflow-hidden flex-shrink-0 relative bg-gray-200"
      style={{ height: size, width: size, minWidth: size, minHeight: size }}
    >
      <Image
        src={person.image}
        alt={person.name}
        width={size * 1.2}
        height={size * 1.2}
        className="absolute top-1/2 left-1/2 object-cover"
        style={{
          objectPosition: position,
          transform: "translate(-50%, -50%)",
        }}
        loading="lazy"
      />
    </div>
  ) : (
    <div
      className={cn(
        "grid place-items-center rounded-full bg-white/10 text-white shadow-md ring-2 ring-white/15 flex-shrink-0"
      )}
      style={{ height: size, width: size, minWidth: size, minHeight: size }}
      aria-hidden
    >
      <span className="text-xl font-bold">{initials}</span>
    </div>
  );
}

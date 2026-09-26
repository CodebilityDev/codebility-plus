"use client";

import type { Person } from "@/types/auth/onboarding/onboarding";
import { cn } from "@/utils/global/cn";

// -------------------------
// Avatar
// -------------------------
export function TeamSectionAvatar({
  person,
  size = 72,
  position = "center top"
}: {
  person: Person;
  size?: number;
  position?: string;
}) {
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
      <img
        src={person.image}
        alt={person.name}
        className="absolute top-1/2 left-1/2 object-cover"
        style={{
          objectPosition: position,
          width: `${size * 1.2}px`,
          height: `${size * 1.2}px`,
          transform: "translate(-50%, -50%)",
          minWidth: `${size * 1.2}px`,
          minHeight: `${size * 1.2}px`
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

"use client";

import { TeamSectionAvatar } from "@/components/auth/onboarding/TeamSectionAvatar";
import type { Person } from "@/types/auth/onboarding/onboarding";

// -------------------------
// PersonCard
// -------------------------
export function PersonCard({ person }: { person: Person }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <TeamSectionAvatar person={person} size={80} />
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-white/90">{person.name}</h4>
        <p className="truncate text-xs text-white/60">{person.role}</p>
      </div>
    </div>
  );
}

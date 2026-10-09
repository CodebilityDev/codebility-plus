"use client";

import InternCards from "@/components/marketing/LandingIntern-CodevCard";
import type { LandingInternCardsProps } from "@/types/marketing/marketing";
import { toTeamMembers } from "@/utils/marketing/marketing";

export function LandingInternCards({ page, initialData }: LandingInternCardsProps) {
  return (
    <InternCards
      key={page}
      interns={toTeamMembers(initialData.TEAM_MEMBERS)}
      playOnMount={page > 1}
    />
  );
}

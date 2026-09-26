"use client";

import InternCards from "@/components/marketing/LandingIntern-CodevCard";
import { LandingInternCardsRemote } from "@/components/marketing/LandingInternCardsRemote";
import type { LandingInternCardsProps } from "@/types/marketing/marketing";
import { toTeamMembers } from "@/utils/marketing/marketing";

export function LandingInternCards({
  page,
  pageSize,
  initialData,
}: LandingInternCardsProps) {
  if (page === initialData.pagination.page) {
    return (
      <InternCards
        key={page}
        interns={toTeamMembers(initialData.TEAM_MEMBERS)}
        playOnMount={page > 1}
      />
    );
  }

  return (
    <LandingInternCardsRemote
      page={page}
      pageSize={pageSize}
      initialData={initialData}
    />
  );
}

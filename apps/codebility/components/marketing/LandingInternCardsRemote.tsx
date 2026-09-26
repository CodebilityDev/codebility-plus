"use client";

import InternCards from "@/components/marketing/LandingIntern-CodevCard";
import { loadPage } from "@/lib/marketing/landing-intern-codev-pagination-loader";
import type { LandingInternCardsRemoteProps } from "@/types/marketing/marketing";
import { toTeamMembers } from "@/utils/marketing/marketing";
import { use } from "react";

export function LandingInternCardsRemote({
  page,
  pageSize,
  initialData,
}: LandingInternCardsRemoteProps) {
  const data = use(loadPage(page, pageSize, initialData));
  return (
    <InternCards
      key={page}
      interns={toTeamMembers(data.TEAM_MEMBERS)}
      playOnMount
    />
  );
}

"use client";

import TeamSection from "@/components/auth/onboarding/TeamSection";
import { useTeamData } from "@/providers/auth/onboarding/TeamDataProvider";

export default function TeamSectionWrapper() {
  const team = useTeamData();

  return <TeamSection team={team} />;
}

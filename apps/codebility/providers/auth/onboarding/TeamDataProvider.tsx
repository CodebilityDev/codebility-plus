"use client";

import { createContext, useContext } from "react";
import type { TeamSectionProps } from "@/types/auth/onboarding/onboarding";

const TeamDataContext = createContext<TeamSectionProps["team"] | null>(null);

export function TeamDataProvider({
  team,
  children,
}: {
  team: TeamSectionProps["team"];
  children: React.ReactNode;
}) {
  return (
    <TeamDataContext.Provider value={team}>{children}</TeamDataContext.Provider>
  );
}

export function useTeamData() {
  const team = useContext(TeamDataContext);
  if (!team) throw new Error("useTeamData must be used within TeamDataProvider");
  return team;
}

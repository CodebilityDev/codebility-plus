"use server";

import { getTeamData as loadTeamData } from "@/lib/global/onboarding-team";

export async function getTeamData() {
  return loadTeamData();
}

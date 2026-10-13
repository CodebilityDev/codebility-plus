import { getTeamData } from "@/lib/global/onboarding-team";
import { TeamDataProvider } from "@/providers/auth/onboarding/TeamDataProvider";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const team = await getTeamData();

  return <TeamDataProvider team={team}>{children}</TeamDataProvider>;
}

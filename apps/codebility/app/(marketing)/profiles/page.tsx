import { Suspense } from "react";
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import Section from "../codevs/_components/CodevsSection";
import CodevContainer from "./_components/CodevContainer";
import CodevList from "./_components/CodevList";

// Helper function to calculate total level score
function calculateLevelScore(
  level: Record<string, number> | undefined,
): number {
  if (!level) return 0;
  return Object.values(level).reduce((sum, levelNum) => sum + levelNum, 0);
}

// Helper function to get number of badges
function getNumberOfBadges(level: Record<string, number> | undefined): number {
  if (!level) return 0;
  return Object.keys(level).length;
}

export default async function Profiles() {
  const adminRoleId = 1;

  const [{ data: allCodevs, error }] = await Promise.all([getCodevs()]);

  if (error) {
    throw new Error("Failed to fetch profiles data");
  }

  const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];

  // First filter out unwanted profiles
  const filteredCodevs = codevsArray.filter(
    (codev) =>
      codev.role_id !== adminRoleId &&
      codev.application_status !== "failed" &&
      codev.application_status !== "applying",
  );

  // Sort codevs based on enhanced priority criteria
  const sortedCodevs = filteredCodevs.sort((a, b) => {
    // Priority 1: Has image_url
    if (a.image_url && !b.image_url) return -1;
    if (b.image_url && !a.image_url) return 1;

    // Priority 2: Is available
    if (a.availability_status && !b.availability_status) return -1;
    if (b.availability_status && !a.availability_status) return 1;

    // Priority 3: Total level score (sum of all levels)
    const aLevelScore = calculateLevelScore(a.level);
    const bLevelScore = calculateLevelScore(b.level);
    if (aLevelScore !== bLevelScore) return bLevelScore - aLevelScore;

    // Priority 4: Number of badges/skill categories
    const aNumBadges = getNumberOfBadges(a.level);
    const bNumBadges = getNumberOfBadges(b.level);
    if (aNumBadges !== bNumBadges) return bNumBadges - aNumBadges;

    // Priority 5: Has work experience
    const aHasExperience =
      Array.isArray(a.work_experience) && a.work_experience.length > 0;
    const bHasExperience =
      Array.isArray(b.work_experience) && b.work_experience.length > 0;
    if (aHasExperience && !bHasExperience) return -1;
    if (bHasExperience && !aHasExperience) return 1;

    // Priority 6: Years of experience
    const aYears = a.years_of_experience || 0;
    const bYears = b.years_of_experience || 0;
    if (aYears !== bYears) return bYears - aYears;

    // If all priorities are equal, maintain original order
    return 0;
  });

  return (
    <Section
      id="codevs"
      className="from-black-500 relative w-full  bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <CodevContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevList codevs={sortedCodevs} />
        </Suspense>
      </div>
    </Section>
  );
}

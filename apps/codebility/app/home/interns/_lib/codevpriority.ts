// utils/codevPriority.ts

import { Codev } from "@/types/home/codev";

// Function to calculate total level score
function calculateLevelScore(level: Record<string, number> | undefined): number {
  if (!level) return 0;
  return Object.values(level).reduce((sum, levelNum) => sum + levelNum, 0);
}

// Function to get number of skill badges
function getNumberOfBadges(level: Record<string, number> | undefined): number {
  if (!level) return 0;
  return Object.keys(level).length;
}

// Function to filter and prioritize Codevs
export function prioritizeCodevs(codevs: Codev[]): Codev[] {
  const adminRoleId = 1;

  // Step 1: Filter out unwanted profiles
  const filteredCodevs = codevs.filter(
    (codev) =>
      codev.role_id !== adminRoleId &&
      codev.application_status !== "failed" &&
      codev.application_status !== "applying"
  );

  // Step 2: Sort codevs based on priority criteria
  return filteredCodevs.sort((a, b) => {
    // Priority 1: Has image_url
    if (a.image_url && !b.image_url) return -1;
    if (b.image_url && !a.image_url) return 1;

    // Priority 2: Is available
    if (a.availability_status && !b.availability_status) return -1;
    if (b.availability_status && !a.availability_status) return 1;

    // Priority 3: Total level score
    const aLevelScore = calculateLevelScore(a.level);
    const bLevelScore = calculateLevelScore(b.level);
    if (aLevelScore !== bLevelScore) return bLevelScore - aLevelScore;

    // Priority 4: Number of badges
    const aNumBadges = getNumberOfBadges(a.level);
    const bNumBadges = getNumberOfBadges(b.level);
    if (aNumBadges !== bNumBadges) return bNumBadges - aNumBadges;

    // Priority 5: Has work experience
    const aHasExperience = Array.isArray(a.work_experience) && a.work_experience.length > 0;
    const bHasExperience = Array.isArray(b.work_experience) && b.work_experience.length > 0;
    if (aHasExperience && !bHasExperience) return -1;
    if (bHasExperience && !aHasExperience) return 1;

    // Priority 6: Years of experience
    const aYears = a.years_of_experience || 0;
    const bYears = b.years_of_experience || 0;
    if (aYears !== bYears) return bYears - aYears;

    // Maintain original order if all are equal
    return 0;
  });
}

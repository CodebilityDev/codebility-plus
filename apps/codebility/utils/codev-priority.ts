/**
 * Utility functions for prioritizing Codev profiles
 */
import { Codev } from "@/types/home/codev";

/**
 * Calculate the total level score for a codev
 * @param level Record of skills and their levels
 * @returns Total level score
 */
export function calculateLevelScore(
  level: Record<string, number> | undefined,
): number {
  if (!level) return 0;
  return Object.values(level).reduce((sum, levelNum) => sum + levelNum, 0);
}

/**
 * Get the number of badges/skills for a codev
 * @param level Record of skills and their levels
 * @returns Number of badges/skills
 */
export function getNumberOfBadges(
  level: Record<string, number> | undefined,
): number {
  if (!level) return 0;
  return Object.keys(level).length;
}

/**
 * Check if a codev has work experience
 * @param workExperience Work experience array
 * @returns Boolean indicating if codev has work experience
 */
export function hasWorkExperience(workExperience: any[] | undefined): boolean {
  return Array.isArray(workExperience) && workExperience.length > 0;
}

/**
 * Prioritize an array of codevs based on various criteria
 * @param codevs Array of codev objects
 * @param filterAdminAndFailed Whether to filter out admin roles and failed/applying applicants
 * @returns Sorted array of codevs
 */
export function prioritizeCodevs(
  codevs: Codev[],
  filterAdminAndFailed: boolean = false,
): Codev[] {
  const adminRoleId = 1;

  // First filter if requested
  let filteredCodevs = codevs;
  if (filterAdminAndFailed) {
    filteredCodevs = codevs.filter(
      (codev) =>
        codev.role_id !== adminRoleId &&
        codev.application_status !== "failed" &&
        codev.application_status !== "applying",
    );
  }

  // Sort codevs based on priority criteria
  return filteredCodevs.sort((a, b) => {
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
    const aHasExperience = hasWorkExperience(a.work_experience);
    const bHasExperience = hasWorkExperience(b.work_experience);
    if (aHasExperience && !bHasExperience) return -1;
    if (bHasExperience && !aHasExperience) return 1;

    // Priority 6: Years of experience
    const aYears = a.years_of_experience || 0;
    const bYears = b.years_of_experience || 0;
    if (aYears !== bYears) return bYears - aYears;

    // If all priorities are equal, maintain original order
    return 0;
  });
}

/**
 * Filter codevs based on various criteria
 */
export function filterCodevs(
  codevs: Codev[],
  filters: {
    positions?: string[];
    projects?: string[];
    availability?: string[];
  },
): Codev[] {
  const { positions = [], projects = [], availability = [] } = filters;

  return codevs.filter((codev) => {
    const matchesPosition =
      positions.length === 0 ||
      positions.includes(codev.display_position || "");

    const matchesAvailability =
      availability.length === 0 ||
      availability
        .map((status) => status.toUpperCase())
        .includes(codev.internal_status || "");

    const matchesProject =
      projects.length === 0 ||
      codev.projects?.some((project) => projects.includes(project.id)) ||
      false;

    return matchesPosition && matchesAvailability && matchesProject;
  });
}

/**
 * Complete codev prioritization and filtering
 * @param codevs Array of codev objects
 * @param filters Filter criteria
 * @param filterAdminAndFailed Whether to filter out admin roles and failed/applying applicants
 * @returns Filtered and prioritized array of codevs
 */
export function getPrioritizedAndFilteredCodevs(
  codevs: Codev[],
  filters: {
    positions?: string[];
    projects?: string[];
    availability?: string[];
  },
  filterAdminAndFailed: boolean = false,
): Codev[] {
  const prioritized = prioritizeCodevs(codevs, filterAdminAndFailed);
  return filterCodevs(prioritized, filters);
}

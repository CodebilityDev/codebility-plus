/**
 * Utility functions for prioritizing Codev profiles
 */
import { Codev, CodevFilter, CodevPoints } from "@/types/home/codev";

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
 * Rank Codev based on badge level and codev points
 * @param level - Record of skill category IDs and their levels
 * @param codevPoints - Array of objects containing id, points, and skill_category_id
 * @returns Object with maxLevel, hasLevel2OrAbove, totalPoints, and validBadgeCount for ranking
 */
export function rankLevelOfBadge(
  level: Record<string, number> | undefined,
  codevPoints: CodevPoints[] | undefined,
): { maxLevel: number; hasLevel2OrAbove: boolean; totalPoints: number; validBadgeCount: number } {
  // Return default values if inputs are missing or invalid
  if (!level || !codevPoints || !Array.isArray(codevPoints)) {
    return { maxLevel: 0, hasLevel2OrAbove: false, totalPoints: 0, validBadgeCount: 0 };
  }

  // Filter valid levels: level > 0 and skill_category_id in codevPoints
  const validSkillCategoryIds = codevPoints.map((point) => point.skill_category_id);
  const validLevels = Object.entries(level).filter(
    ([skillCategoryId, levelValue]) =>
      levelValue > 0 && validSkillCategoryIds.includes(skillCategoryId),
  );

  if (validLevels.length === 0) {
    return { maxLevel: 0, hasLevel2OrAbove: false, totalPoints: 0, validBadgeCount: 0 };
  }

  // Calculate metrics
  const maxLevel = Math.max(...validLevels.map(([, levelValue]) => levelValue));
  const hasLevel2OrAbove = validLevels.some(([, levelValue]) => levelValue >= 2);
  const totalPoints = validLevels.reduce((sum, [skillCategoryId]) => {
    const point = codevPoints.find((p) => p.skill_category_id === skillCategoryId);
    return sum + (point?.points || 0);
  }, 0);
  const validBadgeCount = validLevels.length;

  return { maxLevel, hasLevel2OrAbove, totalPoints, validBadgeCount };
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
    // Priority 1: Level of badge and codev points
    const aRank = rankLevelOfBadge(a.level, a.codev_points);
    const bRank = rankLevelOfBadge(b.level, b.codev_points);

    // Sub-priority 1: Has level 2 or above (highest priority)
    if (aRank.hasLevel2OrAbove !== bRank.hasLevel2OrAbove) {
      return aRank.hasLevel2OrAbove ? -1 : 1;
    }

    // Priority 2: Number of valid badges (that have corresponding codev points)
    if (aRank.validBadgeCount !== bRank.validBadgeCount) {
      return bRank.validBadgeCount - aRank.validBadgeCount; // More valid badges win
    }

    // Priority 3: Has image_url
    if (a.image_url && !b.image_url) return -1;
    if (b.image_url && !a.image_url) return 1;

    // Priority 4: Has work experience
    const aHasExperience = hasWorkExperience(a.work_experience);
    const bHasExperience = hasWorkExperience(b.work_experience);
    if (aHasExperience && !bHasExperience) return -1;
    if (bHasExperience && !aHasExperience) return 1;

    // Priority 5: Years of experience
    const aYears = a.years_of_experience || 0;
    const bYears = b.years_of_experience || 0;
    if (aYears !== bYears) return bYears - aYears;

    // Priority X: Is available
    // if (a.availability_status && !b.availability_status) return -1;
    // if (b.availability_status && !a.availability_status) return 1;

    // If all priorities are equal, maintain original order
    return 0;
  });
}

/**
 * Filter codevs based on various criteria
 */
export function filterCodevs(
  codevs: Codev[],
  filters: CodevFilter,
): Codev[] {
  const { positions = [], projects = [], availability = [], activeStatus = [] } = filters;

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

    const matchesActiveStatus =
      activeStatus.length === 0 ||
      (activeStatus.includes('active') && codev.availability_status === true) ||
      (activeStatus.includes('inactive') && codev.availability_status === false);

    return matchesPosition && matchesAvailability && matchesProject && matchesActiveStatus;
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
  filters: CodevFilter,
  filterAdminAndFailed: boolean = false,
): Codev[] {
  const prioritized = prioritizeCodevs(codevs, filterAdminAndFailed);
  return filterCodevs(prioritized, filters);
}

import { Codev, CodevPoints } from "@/types/home/codev";

/**
 * Calculate total points across all skill categories for a codev
 * @param codev_points - Array of CodevPoints from codev.codev_points
 * @returns Total points sum (0 if undefined/empty)
 */
export const getTotalCodevPoints = (codev_points?: CodevPoints[]): number => {
  if (!codev_points || !Array.isArray(codev_points)) {
    return 0;
  }
  
  return codev_points.reduce((sum, point) => {
    const pointValue = point?.points || 0;
    return sum + pointValue;
  }, 0);
};

/**
 * Check if a codev meets the showcase qualification criteria
 * 
 * Qualification Requirements:
 * 1. Total points >= 100 (graduation requirement)
 * 2. internal_status === "TRAINING" | "GRADUATED" | NULL (active developers)
 * 3. application_status === "passed" (accepted as codev)
 * 4. availability_status === true (currently available for hire)
 * 
 * Note: TRAINING status is included because many active high-performing codevs
 * are still in training phase but meet the 100+ point threshold for showcase.
 * 
 * @param codev - Codev object to check
 * @returns true if codev meets ALL qualification criteria
 */
export const isQualifiedForShowcase = (codev: Codev): boolean => {
  const totalPoints = getTotalCodevPoints(codev.codev_points);
  
  // Check all qualification criteria
  const meetsPointsThreshold = totalPoints >= 100;
  
  // ✅ FIXED: Accept TRAINING, GRADUATED, or NULL status
  // TRAINING = Active codevs building their portfolio (common for 100+ point codevs)
  // GRADUATED = Completed training program
  // NULL = Legacy active codevs without explicit status
  const isActiveCodev = 
    codev.internal_status === "TRAINING" ||
    codev.internal_status === "GRADUATED" || 
    codev.internal_status === null || 
    codev.internal_status === undefined;
  
  const hasPassedApplication = codev.application_status === "passed";
  const isAvailable = codev.availability_status === true;
  
  // Exclude specific statuses that should never show in public showcase
  const isExcludedStatus = 
    codev.internal_status === "INACTIVE" ||
    codev.internal_status === "DEPLOYED" ||
    codev.internal_status === "ADMIN" ||
    codev.internal_status === "MENTOR";
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === "development") {
    if (!meetsPointsThreshold || !isActiveCodev || !hasPassedApplication || !isAvailable || isExcludedStatus) {
      console.log(`❌ ${codev.first_name} ${codev.last_name} disqualified:`, {
        totalPoints,
        meetsPointsThreshold,
        internal_status: codev.internal_status,
        isActiveCodev,
        hasPassedApplication,
        isAvailable,
        isExcludedStatus,
      });
    }
  }
  
  return meetsPointsThreshold && isActiveCodev && hasPassedApplication && isAvailable && !isExcludedStatus;
};

/**
 * Filter an array of codevs to only those who meet showcase qualification
 * @param codevs - Array of Codev objects
 * @returns Filtered array containing only qualified codevs
 */
export const getQualifiedCodevs = (codevs: Codev[]): Codev[] => {
  if (!Array.isArray(codevs)) {
    console.warn("getQualifiedCodevs: Expected array, received:", typeof codevs);
    return [];
  }
  
  const qualified = codevs.filter(isQualifiedForShowcase);
  
  // Debug summary
  if (process.env.NODE_ENV === "development") {
    console.log(`✅ Qualified codevs: ${qualified.length} out of ${codevs.length}`);
  }
  
  return qualified;
};
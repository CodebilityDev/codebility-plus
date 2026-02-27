import { Codev, CodevPoints } from "@/types/home/codev";
/**
 * Calculate total points across all skill categories for a codev
 * @param codev_points - Array of CodevPoints from codev.codev_points
 * @returns Total points sum (0 if undefined/empty)
 * @example getTotalCodevPoints([{points: 50}, {points: 75}]) // Returns 125
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
 * SIMPLIFIED REQUIREMENTS (per team lead feedback):
 * 1. Total points >= 100 (graduation requirement)
 * 2. application_status === "passed" (accepted as codev)
 * 3. availability_status === true (currently available for hire)
 * 
 * Note: internal_status is now IGNORED - we display anyone with 100+ points
 * regardless of TRAINING, GRADUATED, MENTOR, etc. status
 * 
 * @param codev - Codev object to check
 * @returns true if codev meets ALL qualification criteria
 */
export const isQualifiedForShowcase = (codev: Codev): boolean => {
  const totalPoints = getTotalCodevPoints(codev.codev_points);
  
  const meetsPointsThreshold = totalPoints >= 100;
  const hasPassedApplication = codev.application_status === "passed";
  const isAvailable = codev.availability_status === true;
  
  return meetsPointsThreshold && hasPassedApplication && isAvailable;
};
/**
 * Filter an array of codevs to only those who meet showcase qualification
 * @param codevs - Array of Codev objects
 * @returns Filtered array containing only qualified codevs
 */
export const getQualifiedCodevs = (codevs: Codev[]): Codev[] => {
  if (!Array.isArray(codevs)) {
    return [];
  }
  
  return codevs.filter(isQualifiedForShowcase);
};
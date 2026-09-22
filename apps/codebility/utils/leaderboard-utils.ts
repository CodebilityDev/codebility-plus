import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

/**
 * Returns the start and end dates for a week, treating Monday as the first day of the week.
 */
export function getWeekRange() {
  const now = new Date();
  return {
    startDate: startOfWeek(now, { weekStartsOn: 1 }),
    endDate: endOfWeek(now, { weekStartsOn: 1 })
  };
}

/**
 * Returns the start and end dates for the current month.
 */
export function getMonthRange() {
  const now = new Date();
  return {
    startDate: startOfMonth(now),
    endDate: endOfMonth(now)
  };
}

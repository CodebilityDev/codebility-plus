/**
 * Transform a second to a string format of hh:mm (e.g 12:30)
 *
 * @param seconds - number of seconds to convert.
 * @returns {string} - formatted second in (hh:mm)
 */
export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format locale time to remove minutes and second and include only hours and median.
 *
 * @param {string} time - time in locale format (e.g. 10:15:00 PM)
 * @returns { string } - a formatted locale time (e.g. 1 PM)
 */
export const formatLocaleTime = (time: string): string => {
  const [hours, minutes, secondAndMedian] = time.split(":");

  if (
    hours === null ||
    minutes === null ||
    (!secondAndMedian && !(minutes?.includes("AM") || minutes?.includes("PM")))
  )
    throw new Error("Invalid locale time format");

  const median = secondAndMedian
    ? secondAndMedian.split(" ")[1]
    : minutes?.split(" ")[1];

  return hours + " " + median;
};

import { formatNdaDate } from "@/utils/global/date";

export function getSiteDate() {
  const now = new Date();

  return {
    year: now.getFullYear(),
    formatted: formatNdaDate(now),
  };
}

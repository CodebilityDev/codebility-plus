import { cacheLife, cacheTag } from "next/cache";

import { formatNdaDate } from "@/utils/global/date";

export async function getSiteDate() {
  "use cache";
  cacheLife("hours");
  cacheTag("site-date");

  const now = new Date();

  return {
    year: now.getFullYear(),
    formatted: formatNdaDate(now),
  };
}

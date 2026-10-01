import { cacheLife } from "next/cache";

import { formatNdaDate } from "@/utils/global/date";

export async function getSiteDate() {
  "use cache";
  cacheLife("hours");

  const now = await Promise.resolve(new Date());

  return {
    year: now.getFullYear(),
    formatted: formatNdaDate(now),
  };
}

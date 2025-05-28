import { getCodevs } from "@/lib/server/codev.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";

import InHouseView from "./_components/InHouseView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InHousePage() {
  const { data, error } = await getOrSetCache(
    cacheKeys.codevs.inhouse,
    // Fetch Codev data with the desired filter
    () =>
      getCodevs({
        filters: { application_status: "passed" },
      }),
  );

  // Check for errors or missing data
  if (error || !data) {
    throw new Error("Failed to fetch data");
  }

  // Pass the fully prepared data to the view
  return <InHouseView initialData={data} />;
}

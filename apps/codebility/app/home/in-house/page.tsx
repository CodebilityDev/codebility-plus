import { getCodevs } from "@/lib/server/codev.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import PageContainer from "../_components/PageContainer";

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
    return (
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-4xl">⚠️</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Error fetching in-house data</h3>
            <p className="text-gray-600 dark:text-gray-400">Failed to load the in-house team members.</p>
          </div>
        </div>
      </div>
    );
  }

  // Pass the fully prepared data to the view
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <InHouseView initialData={data} />
      </div>
    </div>
  );
}

import { getCodevs } from "@/lib/server/codev.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";

import CodevContainer from "./_components/CodevContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CodevsPage() {
  const { data: allCodevs, error } = await getOrSetCache(
    cacheKeys.codevs.members,
    () => getCodevs(), // Removed { filters: { role_id: 4 } }
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl bg-gray-50/70 p-8 text-center backdrop-blur-sm dark:bg-gray-800/70">
            <div className="mb-4 text-4xl">⚠️</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Error fetching interns</h3>
            <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter only codevs with application_status = "passed" 
  // Include all passed members regardless of their internal_status (active or inactive)
  const passedCodevs = (allCodevs || []).filter(
    (codev) => codev.application_status === "passed"
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-[1600px] px-4 py-12">
        <CodevContainer data={passedCodevs} />
      </div>
    </div>
  );
}

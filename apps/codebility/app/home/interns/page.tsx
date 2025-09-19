import { getCodevs } from "@/lib/server/codev.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import PageContainer from "../_components/PageContainer";

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
      <PageContainer>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="rounded-2xl bg-gray-50/70 p-8 text-center backdrop-blur-sm dark:bg-gray-800/70">
            <div className="mb-4 text-4xl">⚠️</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">Error fetching interns</h3>
            <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Filter only codevs with application_status = "passed" 
  // Include all passed members regardless of their internal_status (active or inactive)
  const passedCodevs = (allCodevs || []).filter(
    (codev) => codev.application_status === "passed"
  );

  return (
    <PageContainer maxWidth="2xl">
      <CodevContainer data={passedCodevs} />
    </PageContainer>
  );
}

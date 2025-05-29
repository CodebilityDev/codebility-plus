import { getCodevs } from "@/lib/server/codev.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";

import CodevContainer from "./_components/CodevContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CodevsPage() {
  const { data: interns, error } = await getOrSetCache(
    cacheKeys.codevs.members,
    () => getCodevs({ filters: { role_id: 4 } }),
  );

  if (error) {
    return <div>Error fetching interns: {error.message}</div>;
  }

  return <CodevContainer data={interns || []} />;
}

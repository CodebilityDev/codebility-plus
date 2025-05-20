import { getCodevs } from "@/lib/server/codev.service";
import { getOrSetCache } from "@/lib/server/redis-cache";

import CodevContainer from "./_components/CodevContainer";

export default async function CodevsPage() {
  const cacheKey = `codevs:role_id=4`;
  const { data: interns, error } = await getOrSetCache(cacheKey, () =>
    getCodevs({ filters: { role_id: 4 } }),
  );

  if (error) {
    return <div>Error fetching interns: {error.message}</div>;
  }

  return <CodevContainer data={interns || []} />;
}

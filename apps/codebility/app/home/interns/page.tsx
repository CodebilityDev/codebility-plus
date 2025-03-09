import { getCodevs } from "@/lib/server/codev.service";

import CodevContainer from "./_components/CodevContainer";

export default async function CodevsPage() {
  const { data: interns, error } = await getCodevs({ filters: { role_id: 4 } });

  if (error) {
    return <div>Error fetching interns: {error.message}</div>;
  }

  return <CodevContainer data={interns || []} />;
}

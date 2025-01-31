import { getCodevs } from "@/lib/server/codev.service";

import InternContainer from "./_components/intern-container";

export default async function Interns() {
  const { data: interns, error } = await getCodevs({ filters: { role_id: 4 } });

  if (error) {
    return <div>Error fetching interns: {error.message}</div>;
  }

  return (
    <div>
      <InternContainer data={interns || []} />
    </div>
  );
}

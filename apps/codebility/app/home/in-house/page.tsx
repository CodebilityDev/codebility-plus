import { getCodevs } from "@/lib/server/codev.service";

import InHouseView from "./_components/in-house-view";

export default async function InHousePage() {
  const { data, error } = await getCodevs();

  if (error) throw new Error("Failed to fetch data");

  // Always pass an array to InHouseView
  return <InHouseView initialData={Array.isArray(data) ? data : []} />;
}

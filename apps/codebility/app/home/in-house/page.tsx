import { getCodevs } from "@/lib/server/codev.service";

import InHouseView from "./_components/InHouseView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InHousePage() {
  // Fetch Codev data with the desired filter
  const { data, error } = await getCodevs({
    filters: { application_status: "passed" },
  });

  // Check for errors or missing data
  if (error || !data) {
    throw new Error("Failed to fetch data");
  }

  // Pass the fully prepared data to the view
  return <InHouseView initialData={data} />;
}

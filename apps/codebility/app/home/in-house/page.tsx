import { getCodevs, getProjects } from "@/lib/server/codev.service";

import InHouseView from "./_components/InHouseView";

export default async function InHousePage() {
  // Fetch Codev data with the desired filter
  const { data, error } = await getCodevs({
    filters: { application_status: "passed" },
  });

  // Check for errors or missing data
  if (error || !data) {
    throw new Error("Failed to fetch data");
  }

  // For each Codev, fetch projects where they’re involved
  const codevsWithProjects = await Promise.all(
    data.map(async (codev) => {
      const { data: projectsData } = await getProjects(codev.id);
      return {
        ...codev,
        projects: projectsData ?? [],
      };
    }),
  );

  // Pass the fully prepared data to the view
  return <InHouseView initialData={codevsWithProjects} />;
}

import {
  getRealProjects,
  getCodevProfiles,
} from "@/actions/settings/services";

import ServicesPageClient from "./_components/ServicesPageClient";

export default async function ServicesPage() {
  // Both datasets were fetched in a client mount effect; resolving them here
  // means the catalog renders complete on first paint with no round trip.
  const [projectsResult, codevsResult] = await Promise.all([
    getRealProjects(),
    getCodevProfiles(),
  ]);

  return (
    <ServicesPageClient
      realProjects={projectsResult.data ?? []}
      codevProfiles={codevsResult.data ?? []}
    />
  );
}

import { getRealProjects, getCodevProfiles } from "@/lib/global/proposal-public";
import { getSiteDate } from "@/lib/global/site-date";

import ProposalView from "@/components/global/marketing/ProposalView";

export default async function ProposalPage() {
  const [projectsResult, codevsResult, { year }] = await Promise.all([
    getRealProjects(),
    getCodevProfiles(),
    Promise.resolve(getSiteDate()),
  ]);

  return (
    <ProposalView
      realProjects={projectsResult.data ?? []}
      codevProfiles={codevsResult.data}
      year={year}
    />
  );
}
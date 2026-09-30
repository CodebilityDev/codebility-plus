import { getRealProjects, getCodevProfiles } from "@/lib/global/proposal-public";

import ProposalView from "@/components/global/marketing/ProposalView";

export default async function ProposalPage() {
  const [projectsResult, codevsResult] = await Promise.all([
    getRealProjects(),
    getCodevProfiles(),
  ]);

  return (
    <ProposalView
      realProjects={projectsResult.data ?? []}
      codevProfiles={codevsResult.data ?? []}
    />
  );
}
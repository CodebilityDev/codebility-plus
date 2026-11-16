import SectionError from "@/components/global/feedback/SectionError";
import { reportError } from "@/lib/global/error-reporting";
import { getRealProjects, getCodevProfiles } from "@/lib/global/proposal-public";

import ProposalView from "@/components/global/marketing/ProposalView";

export async function ProposalData() {
  const results = await Promise.all([
    getRealProjects(),
    getCodevProfiles(),
  ]).catch((error) => {
    reportError(error, {
      source: "section",
      boundary: "ProposalData",
      route: "/proposal",
      section: "proposal-data",
    });
    return null;
  });

  if (!results) return <SectionError />;

  const [realProjects, codevProfiles] = results;

  return (
    <ProposalView realProjects={realProjects} codevProfiles={codevProfiles} />
  );
}

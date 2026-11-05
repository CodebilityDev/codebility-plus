import { Suspense } from "react";

import { ProposalData } from "@/components/proposal/ProposalData";
import { ProposalSkeleton } from "@/components/proposal/ProposalSkeleton";
import { ProposalChrome } from "@/components/global/marketing/ProposalChrome";
import { getSiteDate } from "@/lib/global/site-date";

export default async function ProposalPage() {
  const { year } = await getSiteDate();

  return (
    <ProposalChrome year={year}>
      <Suspense fallback={<ProposalSkeleton />}>
        <ProposalData />
      </Suspense>
    </ProposalChrome>
  );
}

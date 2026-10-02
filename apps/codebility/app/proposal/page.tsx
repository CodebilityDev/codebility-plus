import { Suspense } from "react";

import { ProposalData } from "@/components/proposal/ProposalData";
import { ProposalSkeleton } from "@/components/proposal/ProposalSkeleton";

export default function ProposalPage() {
  return (
    <Suspense fallback={<ProposalSkeleton />}>
      <ProposalData />
    </Suspense>
  );
}

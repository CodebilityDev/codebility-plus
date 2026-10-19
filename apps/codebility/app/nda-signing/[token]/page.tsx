import { Suspense } from "react";

import NdaSigningTokenClient from "@/components/nda-signing/NdaSigningTokenClient";
import { NdaSigningSkeleton } from "@/components/nda-signing/NdaSigningSkeleton";
import { getNdaRequestCodevId } from "@/lib/global/nda-requests";
import { getSiteDate } from "@/lib/global/site-date";
import type { NdaSigningTokenPageProps } from "@/types/global/nda-signing";

export const instant = false;

export default function NdaSigningTokenPage({ params }: NdaSigningTokenPageProps) {
  return (
    <Suspense fallback={<NdaSigningSkeleton />}>
      <NdaSigningTokenContent params={params} />
    </Suspense>
  );
}

async function NdaSigningTokenContent({ params }: NdaSigningTokenPageProps) {
  const { token } = await params;
  const [{ formatted }, codevId] = await Promise.all([
    getSiteDate(),
    getNdaRequestCodevId(token),
  ]);

  return <NdaSigningTokenClient agreementDate={formatted} codevId={codevId} />;
}

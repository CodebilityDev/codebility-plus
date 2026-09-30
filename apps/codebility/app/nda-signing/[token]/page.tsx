import { Suspense } from "react";

import NdaSigningTokenClient from "@/components/nda-signing/NdaSigningTokenClient";
import { getNdaRequestCodevId } from "@/lib/global/nda-requests";
import { getSiteDate } from "@/lib/global/site-date";
import type { NdaSigningTokenPageProps } from "@/types/global/nda-signing";

export const instant = false;

export default async function NdaSigningTokenPage({ params }: NdaSigningTokenPageProps) {
  const { token } = await params;
  const [{ formatted }, codevId] = await Promise.all([
    Promise.resolve(getSiteDate()),
    getNdaRequestCodevId(token),
  ]);

  return (
    <Suspense fallback={null}>
      <NdaSigningTokenClient agreementDate={formatted} codevId={codevId} />
    </Suspense>
  );
}
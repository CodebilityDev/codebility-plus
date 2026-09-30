import { Suspense } from "react";

import NdaSigningTokenClient from "@/components/nda-signing/NdaSigningTokenClient";
import { getSiteDate } from "@/lib/global/site-date";

export default async function NdaSigningTokenPage() {
  const { formatted } = await getSiteDate();

  return (
    <Suspense fallback={null}>
      <NdaSigningTokenClient agreementDate={formatted} />
    </Suspense>
  );
}

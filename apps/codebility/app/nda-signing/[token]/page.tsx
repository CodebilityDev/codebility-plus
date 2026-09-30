import { Suspense } from "react";
import NdaSigningTokenClient from "@/components/nda-signing/NdaSigningTokenClient";

export default function NdaSigningTokenPage() {
  return (
    <Suspense fallback={null}>
      <NdaSigningTokenClient />
    </Suspense>
  );
}

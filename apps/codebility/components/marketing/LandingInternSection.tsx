import { Suspense } from "react";

import LandingInternSkeleton from "@/components/marketing/LandingInternSkeleton";
import LandingInternShell from "@/components/marketing/LandingInternShell";
import { LandingIntern } from "@/components/marketing/LandingIntern";



export default function InternSectionContainer() {
  return (
    <LandingInternShell>
      <Suspense fallback={<LandingInternSkeleton />}>
        <LandingIntern />
      </Suspense>
    </LandingInternShell>
  );
}

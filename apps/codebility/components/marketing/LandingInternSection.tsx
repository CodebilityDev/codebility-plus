import { Suspense } from "react";

import LandingInternSkeleton from "@/components/marketing/LandingInternSkeleton";
import LandingInternShell from "@/components/marketing/LandingInternShell";
import { LandingIntern } from "@/components/marketing/LandingIntern";
import type { LandingInternProps } from "@/types/marketing/marketing";

export default function InternSectionContainer({ searchParams }: LandingInternProps) {
  return (
    <LandingInternShell>
      <Suspense fallback={<LandingInternSkeleton />}>
        <LandingIntern searchParams={searchParams} />
      </Suspense>
    </LandingInternShell>
  );
}

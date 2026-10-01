import { Suspense } from "react";

import CodevsProfilesContainer from "@/components/global/marketing/CodevsProfilesContainer";
import CodevsProfilesData from "@/components/global/marketing/CodevsProfilesData";
import { CodevsProfilesSkeleton } from "@/components/global/marketing/CodevsProfilesSkeleton";
import Section from "@/components/global/marketing/CodevsSection";
import { PAGE_SIZE } from "@/constants/global/marketing";
import type { CodevsProfilesProps } from "@/types/global/marketing";

export default function CodevsProfiles({ searchParams }: CodevsProfilesProps) {
  return (
    <Section
      id="codevs-profiles"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <CodevsProfilesContainer />
        <Suspense fallback={<CodevsProfilesSkeleton count={PAGE_SIZE} />}>
          <CodevsProfilesData searchParams={searchParams} />
        </Suspense>
      </div>
    </Section>
  );
}

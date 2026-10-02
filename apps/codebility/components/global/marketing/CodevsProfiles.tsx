import { Suspense } from "react";

import CodevsProfilesContainer from "@/components/global/marketing/CodevsProfilesContainer";
import CodevsProfilesData from "@/components/global/marketing/CodevsProfilesData";
import { CodevsProfilesFallback } from "@/components/global/marketing/CodevsProfilesFallback";
import Section from "@/components/global/marketing/CodevsSection";
import { getCachedCodevsProfilePositions } from "@/lib/global/codevs-profiles-cached";
import type { CodevsProfilesProps } from "@/types/global/marketing";

export default async function CodevsProfiles({ searchParams }: CodevsProfilesProps) {
  // The role list does not depend on the URL, so it is cached and lands in the
  // static shell. Only the profile grid waits on the per-page fetch.
  const positions = (await getCachedCodevsProfilePositions()) ?? [];

  return (
    <Section
      id="codevs-profiles"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <CodevsProfilesContainer />
        <Suspense fallback={<CodevsProfilesFallback positions={positions} />}>
          <CodevsProfilesData searchParams={searchParams} />
        </Suspense>
      </div>
    </Section>
  );
}

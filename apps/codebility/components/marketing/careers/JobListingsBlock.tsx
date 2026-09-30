import { Suspense } from "react";

import JobListingsSection from "@/components/marketing/careers/JobListingsSection";
import { JobListingsFallback } from "@/components/marketing/careers/JobListingsFallback";
import type { JobListingsBlockProps } from "@/types/marketing/careers/careers";

export function JobListingsBlock({ searchParams }: JobListingsBlockProps) {
  return (
    <Suspense fallback={<JobListingsFallback />}>
      <JobListingsSection searchParams={searchParams} />
    </Suspense>
  );
}

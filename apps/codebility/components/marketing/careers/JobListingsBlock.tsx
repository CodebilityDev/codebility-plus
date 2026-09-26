import { Suspense } from "react";
import { pageSize } from "@/constants/global/page-size";

import JobListingsSection from "@/components/marketing/careers/JobListingsSection";
import JobListingsShell from "@/components/marketing/careers/JobListingsShell";

const PAGE_SIZE = pageSize.careersJobs;

export function JobListingsFallback() {
  return <JobListingsShell loading pageSize={PAGE_SIZE} />;
}

export function JobListingsBlock() {
  return (
    <Suspense fallback={<JobListingsFallback />}>
      <JobListingsSection />
    </Suspense>
  );
}

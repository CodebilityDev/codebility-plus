import { Suspense } from "react";
import { pageSize } from "@/constants";

import JobListingsSection from "./JobListingsSection";
import JobListingsShell from "./JobListingsShell";

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

import { Suspense } from "react";


import JobListingsSection from "@/components/marketing/careers/JobListingsSection";
import { JobListingsFallback } from "@/components/marketing/careers/JobListingsFallback";



export function JobListingsBlock() {
  return (
    <Suspense fallback={<JobListingsFallback />}>
      <JobListingsSection />
    </Suspense>
  );
}

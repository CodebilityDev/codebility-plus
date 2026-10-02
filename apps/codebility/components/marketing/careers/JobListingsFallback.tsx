import { JobListingsFilter } from "@/components/marketing/careers/JobListingsFilter";
import { JobListingsSkeleton } from "@/components/marketing/careers/JobListingsSkeleton";
import { PAGE_SIZE } from "@/constants/marketing/careers/careers";
import type { JobListingsFallbackProps } from "@/types/marketing/careers/careers";

export function JobListingsFallback({ departments }: JobListingsFallbackProps) {
  return (
    <>
      <JobListingsFilter
        departments={departments}
        department={null}
        type={null}
        level={null}
      />
      <JobListingsSkeleton count={PAGE_SIZE} />
    </>
  );
}

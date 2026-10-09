import JobListingsPagination from "@/components/marketing/careers/JobListingsPagination";
import type { JobListingsBodyProps } from "@/types/marketing/careers/careers";

export function JobListingsBody({ initialData, pageSize }: JobListingsBodyProps) {
  if (!initialData) {
    return (
      <p className="py-12 text-center text-red-400">
        Failed to load job listings. Please try again later.
      </p>
    );
  }

  return <JobListingsPagination initialData={initialData} pageSize={pageSize} />;
}

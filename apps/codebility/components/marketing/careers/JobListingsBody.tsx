"use client";

import JobListingsPagination from "@/components/marketing/careers/JobListingsPagination";
import { JobListingsSkeleton } from "@/components/marketing/careers/JobListingsSkeleton";
import type { JobListingsShellProps } from "@/types/marketing/careers/careers";

export function JobListingsBody({
  initialData,
  pageSize,
  loading,
}: JobListingsShellProps) {
  if (loading) {
    return <JobListingsSkeleton count={pageSize} />;
  }

  if (!initialData) {
    return (
      <p className="py-12 text-center text-red-400">
        Failed to load job listings. Please try again later.
      </p>
    );
  }

  if (initialData.jobs.length === 0 && initialData.pagination.total === 0) {
    return (
      <p className="py-12 text-center text-gray-400">
        No open positions at the moment. Please check back later.
      </p>
    );
  }

  return (
    <JobListingsPagination initialData={initialData} pageSize={pageSize} />
  );
}

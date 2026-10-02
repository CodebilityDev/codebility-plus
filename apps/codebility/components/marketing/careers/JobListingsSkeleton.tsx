import { JobListingCardSkeleton } from "@/components/marketing/careers/JobListingCardSkeleton";
import type { JobListingsSkeletonProps } from "@/types/marketing/careers/careers";

export function JobListingsSkeleton({ count = 4 }: JobListingsSkeletonProps) {
  return (
    <div className="grid gap-6" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <JobListingCardSkeleton key={index} />
      ))}
    </div>
  );
}

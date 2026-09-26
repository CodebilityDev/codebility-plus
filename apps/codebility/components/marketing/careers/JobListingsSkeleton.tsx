import { JobListingCardSkeleton } from "@/components/marketing/careers/JobListingCardSkeleton";


export function JobListingsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <JobListingCardSkeleton key={index} />
      ))}
    </div>
  );
}

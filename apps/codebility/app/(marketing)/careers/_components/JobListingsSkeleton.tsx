import { Skeleton } from "@/components/ui/skeleton/skeleton";

function JobListingCardSkeleton() {
  return (
    <div
      className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <Skeleton className="mb-2 h-7 w-3/4 max-w-sm rounded bg-white/10" />
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Skeleton className="h-4 w-24 rounded bg-white/10" />
              <Skeleton className="h-4 w-20 rounded bg-white/10" />
              <Skeleton className="h-4 w-28 rounded bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 shrink-0 rounded-full bg-white/10 sm:mt-0" />
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full rounded bg-white/10" />
        <Skeleton className="h-4 w-11/12 rounded bg-white/10" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
        <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
        <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
        <Skeleton className="h-4 w-24 rounded bg-white/10" />
      </div>

      <div className="border-t border-gray-800 pt-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full bg-white/10" />
          <Skeleton className="h-7 w-24 rounded-full bg-white/10" />
          <Skeleton className="h-7 w-16 rounded-full bg-white/10" />
          <Skeleton className="h-7 w-28 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export function JobListingsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <JobListingCardSkeleton key={index} />
      ))}
    </div>
  );
}

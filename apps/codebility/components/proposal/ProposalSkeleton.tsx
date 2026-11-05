import { Skeleton } from "@/components/global/ui/skeleton";

const PROJECT_COUNT = 8;
const FEATURE_COUNT = 8;

export function ProposalSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-8 py-12"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton className="mb-2 h-10 w-72 rounded bg-white/10" />
      <Skeleton className="mb-8 h-6 w-96 max-w-full rounded bg-white/10" />

      <div className="mb-8">
        <Skeleton className="mb-4 h-6 w-28 rounded bg-white/10" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PROJECT_COUNT }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border-2 border-dark-100 bg-black-600"
              aria-hidden="true"
            >
              <Skeleton className="h-40 w-full rounded-none bg-white/10" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 rounded bg-white/10" />
                <Skeleton className="mt-1 h-3 w-1/2 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-lg border-2 border-dark-100 bg-black-600 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded bg-white/10" />
          <div>
            <Skeleton className="h-6 w-40 rounded bg-white/10" />
            <Skeleton className="mt-1 h-4 w-28 rounded bg-white/10" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Skeleton className="mb-4 h-6 w-32 rounded bg-white/10" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: FEATURE_COUNT }, (_, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-dark-100 bg-black-600 p-3"
              aria-hidden="true"
            >
              <Skeleton className="mt-0.5 h-4 w-4 rounded bg-white/10" />
              <Skeleton className="h-4 w-full rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

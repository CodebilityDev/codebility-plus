import { Skeleton } from "@/components/global/ui/skeleton";
import type { ProfileProjectsSkeletonProps } from "@/types/marketing/profiles/profiles";

export function ProfileProjectsSkeleton({ count = 2 }: ProfileProjectsSkeletonProps) {
  return (
    <div className="mt-4 w-full" aria-busy="true" aria-hidden="true">
      <Skeleton className="mx-auto mb-4 h-7 w-24 rounded bg-white/10" />
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="w-40 rounded-lg bg-black-100 p-4 text-center"
          >
            <Skeleton className="h-32 w-full rounded bg-white/10" />
            <Skeleton className="mx-auto mt-2 h-5 w-24 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

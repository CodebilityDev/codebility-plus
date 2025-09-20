import { InHouseHeaderSkeleton } from "./InHouseHeaderSkeleton";
import { InHouseTableSkeleton } from "./InHouseTableSkeleton";

interface InHouseLoadingSkeletonProps {
  rows?: number;
}

export function InHouseLoadingSkeleton({ rows = 8 }: InHouseLoadingSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header with title, stats, tabs and filters skeleton */}
      <InHouseHeaderSkeleton />
      
      {/* Table skeleton */}
      <InHouseTableSkeleton rows={rows} />
    </div>
  );
}

// Export individual components for more granular use
export { InHouseHeaderSkeleton, InHouseTableSkeleton };

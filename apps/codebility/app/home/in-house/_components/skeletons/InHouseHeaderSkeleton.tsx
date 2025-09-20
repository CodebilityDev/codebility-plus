import { Skeleton } from "@codevs/ui/skeleton";

export function InHouseHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {/* Title and stats skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Page title skeleton */}
            <Skeleton className="h-6 w-48" />
            
            {/* Stats badges skeleton */}
            <div className="flex items-center gap-1 text-[10px]">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-18 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Tabs and filters skeleton */}
        <div className="flex flex-col gap-4">
          {/* Tabs skeleton */}
          <div className="flex gap-2">
            <div className="grid h-9 w-full max-w-[280px] grid-cols-2 gap-1 rounded-md bg-gray-100 p-1 dark:bg-gray-800">
              <Skeleton className="h-7 w-full rounded-sm" />
              <Skeleton className="h-7 w-full rounded-sm" />
            </div>
          </div>
          
          {/* Filters skeleton */}
          <div className="flex flex-wrap gap-4">
            {/* Search filter skeleton */}
            <div className="min-w-[250px] flex-1">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            
            {/* Status filter skeleton */}
            <div className="min-w-[120px]">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            
            {/* Position filter skeleton */}
            <div className="min-w-[150px]">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            
            {/* Project filter skeleton */}
            <div className="min-w-[130px]">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            
            {/* NDA filter skeleton */}
            <div className="min-w-[120px]">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            
            {/* Role filter skeleton */}
            <div className="min-w-[110px]">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            
            {/* Available filter skeleton */}
            <div className="min-w-[140px]">
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

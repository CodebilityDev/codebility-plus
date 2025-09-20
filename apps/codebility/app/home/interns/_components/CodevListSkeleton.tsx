import { Skeleton } from "@/components/ui/skeleton/skeleton";
import CodevCardSkeleton from "./CodevCardSkeleton";

export default function CodevListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Grid of skeleton cards */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <CodevCardSkeleton key={index} />
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20 bg-gray-200 dark:bg-gray-700" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-10 bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
          <Skeleton className="h-10 w-20 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

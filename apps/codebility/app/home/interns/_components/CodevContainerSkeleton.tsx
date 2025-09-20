import { Skeleton } from "@/components/ui/skeleton/skeleton";
import CodevListSkeleton from "./CodevListSkeleton";

export default function CodevContainerSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      {/* Header Section Skeleton */}
      <div className="text-center">
        <div className="mb-6">
          <Skeleton className="mx-auto h-12 w-80 bg-gray-200 dark:bg-gray-700" />
          <div className="via-customBlue-400 mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent to-transparent"></div>
        </div>
        <Skeleton className="mx-auto h-6 w-96 max-w-2xl bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Main Tabs Skeleton */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="grid w-full grid-cols-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <Skeleton className="h-10 rounded-md bg-gray-200 dark:bg-gray-600" />
            <Skeleton className="h-10 rounded-md bg-gray-200 dark:bg-gray-600" />
          </div>
        </div>
      </div>

      {/* Sub-tabs Skeleton */}
      <div className="flex justify-center">
        <div className="w-full max-w-xl">
          <div className="grid w-full grid-cols-3 rounded-lg bg-gray-50 p-1 dark:bg-gray-900">
            <Skeleton className="h-10 rounded-md bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-10 rounded-md bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-10 rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Controls Section Skeleton */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-end">
        <div className="w-full max-w-md">
          <Skeleton className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
        <div>
          <Skeleton className="h-10 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Content Section Skeleton */}
      <CodevListSkeleton />
    </div>
  );
}

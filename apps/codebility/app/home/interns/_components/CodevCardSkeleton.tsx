import { Skeleton } from "@/components/ui/skeleton/skeleton";

export default function CodevCardSkeleton() {
  return (
    <div className="group relative h-full rounded-2xl bg-white/70 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-800/70">
      <div className="flex h-full flex-col justify-start gap-4">
        {/* Header Section */}
        <div className="relative flex items-start justify-start gap-4">
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-customBlue-100 to-purple-100 p-0.5 dark:from-customBlue-900 dark:to-purple-900">
              <Skeleton className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            {/* Status dot */}
            <div className="absolute -bottom-1 -right-1">
              <Skeleton className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>

          {/* Name and position info */}
          <div className="flex flex-1 flex-col items-start justify-start gap-2">
            <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
            {/* Level badge skeleton */}
            <Skeleton className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4">
          {/* Skill points grid */}
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-lg bg-white/50 p-1 backdrop-blur-sm dark:bg-gray-700/50"
              >
                <Skeleton className="h-3 w-6 bg-gray-200 dark:bg-gray-600" />
                <Skeleton className="h-2 w-8 bg-gray-200 dark:bg-gray-600" />
              </div>
            ))}
          </div>

          {/* Tech Stacks */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            ))}
            <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>

        {/* Projects */}
        <div className="mt-auto flex flex-wrap justify-end gap-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

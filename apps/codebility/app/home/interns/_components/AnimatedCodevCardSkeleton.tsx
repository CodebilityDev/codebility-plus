import { Skeleton } from "@/components/ui/skeleton/skeleton";

interface AnimatedCodevCardSkeletonProps {
  delay?: number;
}

export default function AnimatedCodevCardSkeleton({ delay = 0 }: AnimatedCodevCardSkeletonProps) {
  return (
    <div 
      className="group relative h-full rounded-2xl bg-white/70 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-800/70 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-gray-600/30" />
      
      <div className="flex h-full flex-col justify-start gap-4">
        {/* Header Section */}
        <div className="relative flex items-start justify-start gap-4">
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-customBlue-100 to-purple-100 p-0.5 dark:from-customBlue-900 dark:to-purple-900">
              <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            {/* Status dot */}
            <div className="absolute -bottom-1 -right-1">
              <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          </div>

          {/* Name and position info */}
          <div className="flex flex-1 flex-col items-start justify-start gap-2">
            <div className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            {/* Level badge skeleton */}
            <div className="h-5 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
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
                <div className="h-3 w-6 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
                <div className="h-2 w-8 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Tech Stacks */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
            <div className="h-4 w-12 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>

        {/* Projects */}
        <div className="mt-auto flex flex-wrap justify-end gap-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-6 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

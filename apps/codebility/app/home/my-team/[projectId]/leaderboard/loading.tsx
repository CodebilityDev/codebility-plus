import { Trophy, Medal, ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LeaderboardLoading() {
  return (
    <div className="flex w-full flex-col p-4 md:p-8 relative min-h-screen animate-pulse">
      {/* Header and Breadcrumbs Skeleton */}
      <div className="mb-2 flex flex-col gap-4 relative z-20">
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
        
        <div className="flex items-center justify-between">
          <div>
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
            <div className="mt-2 h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>

      {/* Main Leaderboard Canvas Skeleton */}
      <div className="relative w-full mt-4 md:mt-8">
        
        {/* TOP 3 SHOWCASE CARDS SKELETON */}
        <div className="relative z-10 flex flex-col md:flex-row justify-center items-stretch md:items-center gap-6 md:gap-8 mb-12 md:mb-16 pt-8 md:pt-24 px-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col relative w-full md:max-w-[280px] h-[320px] rounded-[32px] p-6 bg-gray-100/50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/50 shadow-xl">
              <div className="absolute top-4 right-6 h-10 w-10 bg-gray-200 dark:bg-gray-700/50 rounded" />
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700/50 mx-auto mt-4" />
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700/50 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700/30 rounded" />
              </div>
              <div className="mt-8 h-10 w-32 bg-gray-200 dark:bg-gray-700/50 rounded-2xl mx-auto" />
            </div>
          ))}
        </div>

        {/* LIST SECTION SKELETON */}
        <div className="relative z-10 w-full max-w-5xl mx-auto bg-white/50 dark:bg-gray-950/40 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl border border-gray-200 dark:border-gray-800 mb-8">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-800/80 mb-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-800 rounded ${i === 1 ? 'col-span-1' : i === 2 ? 'col-span-5' : 'col-span-3'}`} />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-12 gap-4 items-center px-6 py-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-transparent">
                <div className="col-span-1 h-8 w-8 bg-gray-200 dark:bg-gray-700/50 rounded mx-auto" />
                <div className="col-span-5 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700/50" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700/50 rounded" />
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700/30 rounded" />
                  </div>
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700/50 rounded-full" />
                </div>
                <div className="col-span-3 flex justify-end">
                   <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700/50 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";
import H1 from "@/components/shared/dashboard/H1";
import DashboardClient from "./_components/DashboardClient";

// Loading component for better UX
function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="md:basis-[50%] xl:basis-[60%]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
            <div className="h-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div className="md:basis-[50%] xl:basis-[40%]">
        <div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
        <div className="absolute top-1/2 -right-4 h-96 w-96 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-4 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />
      </div>
      
      <div className="relative mx-auto flex max-w-screen-xl flex-col gap-6 p-6">
        {/* Enhanced Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome Home
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Track your progress and climb the leaderboards</p>
            </div>
          </div>
          
          {/* Quick stats bar */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Active Today</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">🔥 Streak:</span>
                <span className="text-sm font-bold text-orange-500">7 days</span>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">🎯 Goal:</span>
                <span className="text-sm font-bold text-blue-500">50 points this week</span>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<DashboardLoading />}>
          <DashboardClient />
        </Suspense>
      </div>
    </div>
  );
}
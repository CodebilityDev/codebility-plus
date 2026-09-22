import { Suspense } from "react";
import { fetchActiveModal } from "@/actions/promote-modal/actions";

import FeaturePromoModal from "./promote-modal/_components/FeaturePromoModal";
import DashboardContent from "./_components/DashboardContent";
import NewsBanner from "./_components/NewsBanner";

function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row ">
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

export default async function DashboardPage() {
  const modal = await fetchActiveModal();

  return (
    <div className="w-full">
      {modal && <FeaturePromoModal data={modal} />}

      <div className="relative mb-8 flex flex-col gap-4 pt-4">
        {/* Background decorations - contained within content area */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="from-customBlue-400/10 absolute left-4 top-4 h-72 w-72 rounded-full bg-gradient-to-br to-purple-400/10 blur-3xl" />
          <div className="to-customBlue-400/10 absolute right-4 top-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-green-400/10 blur-3xl" />
          <div className="absolute bottom-4 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <Suspense fallback={null}>
            <NewsBanner />
          </Suspense>

          {/* Enhanced Header */}
          <div className="mb-6 mt-3">
            <div className="mb-2 flex items-center gap-4">
              <div className="from-customBlue-500 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br to-purple-500">
                <span className="text-2xl">🏠</span>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
                  Welcome Home
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Track your progress and climb the leaderboards
                </p>
              </div>
            </div>

            {/*
            TODO: Quick stats bar for future features

            <div className="flex flex-wrap gap-2 sm:gap-4 mt-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">🔥 Streak:</span>
                  <span className="text-xs sm:text-sm font-bold text-orange-500">7 days</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg px-3 sm:px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">🎯 Goal:</span>
                  <span className="text-xs sm:text-sm font-bold text-customBlue-500">50 points this week</span>
                </div>
              </div>
            </div>
            */}
          </div>

          <Suspense fallback={<DashboardLoading />}>
            <DashboardContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

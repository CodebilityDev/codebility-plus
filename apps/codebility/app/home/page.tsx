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
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Home</H1>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardClient />
      </Suspense>
    </div>
  );
}
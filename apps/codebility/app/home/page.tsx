"use client";

import { useEffect, useState } from "react";
import H1 from "@/Components/shared/dashboard/H1";
import { useUserStore } from "@/store/codev-store";

import DashboardCurrentProject from "./(dashboard)/_components/DashboardCurrentProject";
import Profile from "./(dashboard)/_components/DashboardProfile";
import TokenPoints from "./(dashboard)/_components/DashboardTokenPoints";
import WeeklyTop from "./(dashboard)/_components/DashboardWeeklyTop";

export default function DashboardPage() {
  const { user } = useUserStore();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before rendering components that might use Supabase
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render until we're sure we're on the client
  if (!isClient) {
    return (
      <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
        <H1>Home</H1>
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Home</H1>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className=" md:basis-[50%] xl:basis-[60%]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
              <Profile />
              {/* <TimeTracker /> */}
            </div>
            <DashboardCurrentProject />
            <TokenPoints />
            {/* <DashboardRoadmap /> Hide Temporarily */}
          </div>
        </div>
        <div className="md:basis-[50%] xl:basis-[40%]">
          <WeeklyTop />
        </div>
      </div>
    </div>
  );
}
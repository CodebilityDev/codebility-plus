"use client";

import H1 from "@/Components/shared/dashboard/H1";
import { useUserStore } from "@/store/codev-store";

import DashboardCurrentProject from "./(dashboard)/_components/DashboardCurrentProject";
import Profile from "./(dashboard)/_components/DashboardProfile";
import DashboardRoadmap from "./(dashboard)/_components/DashboardRoadmap";
import TimeTracker from "./(dashboard)/_components/DashboardTimeTracker";
import TokenPoints from "./(dashboard)/_components/DashboardTokenPoints";
import WeeklyTop from "./(dashboard)/_components/DashboardWeeklyTop";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function DashboardPage() {
  const { user } = useUserStore();

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

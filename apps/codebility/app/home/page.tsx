import H1 from "@/Components/shared/dashboard/H1";

import Profile from "./(dashboard)/_components/dashboard-profile";
import TimeTracker from "./(dashboard)/_components/dashboard-time-tracker";
import TokenPoints from "./(dashboard)/_components/dashboard-token-points";
import WeeklyTop from "./(dashboard)/_components/dashboard-weekly-top";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Dashboard</H1>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className=" md:basis-[50%] xl:basis-[60%]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
              <Profile />
              {/* <TimeTracker /> */}
            </div>
            <TokenPoints />
          </div>
        </div>
        <div className="md:basis-[50%] xl:basis-[40%]">
          <WeeklyTop />
        </div>
      </div>
    </div>
  );
}

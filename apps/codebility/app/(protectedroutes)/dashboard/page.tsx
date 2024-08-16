"use client"

import Profile from "@/app/(protectedroutes)/dashboard/Profile"
import WeeklyTop from "@/app/(protectedroutes)/dashboard/WeeklyTop"
import TimeTracker from "@/app/(protectedroutes)/dashboard/TimeTracker"
import TokenPoints from "@/app/(protectedroutes)/dashboard/TokenPoints"
import H1 from "@/Components/shared/dashboard/H1"

export default function DashboardPage() {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      <H1>Dashboard</H1>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className=" md:basis-[50%] xl:basis-[60%]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
              <Profile />
              <TimeTracker />
            </div>
            <TokenPoints />
          </div>
        </div>
        <div className="md:basis-[50%] xl:basis-[40%]">
          <WeeklyTop />
        </div>
      </div>
    </div>
  )
}

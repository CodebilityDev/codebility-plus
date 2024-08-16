"use client"

import useAuth from "@/hooks/use-auth"
import TimeTrackerTable from "@/app/(protectedroutes)/time-tracker/TimeTrackerTable"
import H1 from "@/Components/shared/dashboard/H1"
import Box from "@/Components/shared/dashboard/Box"
import { excessHours, totalRenderedHours } from "@/app/(protectedroutes)/time-tracker/data"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"

const TimeTracker = () => {
  const { isLoading } = useAuth()

  return (
    <>
      <div className="max-w-screen-xl mx-auto flex w-full flex-col justify-center gap-4  ">
        <H1>Time Logs</H1>

        <div className="flex flex-col gap-4 lg:flex-row">
          {!isLoading ? (
            <>
              <Box className="flex w-full min-h-[200px] flex-1 flex-col items-center gap-4 text-center md:flex-row lg:w-1/2">
                <Box className="w-full">
                  <H1>{totalRenderedHours}</H1>
                  <p className="text-gray">Rendered Hours </p>
                </Box>
                <Box className="w-full">
                  <H1>{excessHours} </H1>
                  <p className="text-gray">Excess Hours</p>
                </Box>
              </Box>
              <Box className="flex min-h-[200px] flex-col items-center justify-center lg:w-1/2">
                <p className="text-gray">My Time Schedule</p>
                <H1 className="pt-2 text-2xl md:text-4xl">8:00 - 5:00</H1>
              </Box>
            </>
          ) : (
            <>
              <Box className="flex flex-col gap-4 md:w-1/2 md:flex-col">
                <div className="flex w-full gap-4">
                  <Skeleton className="h-40 min-w-[9rem] md:w-1/2" />
                  <Skeleton className="h-40 min-w-[9rem] md:w-1/2" />
                </div>
              </Box>
              <Box className="h-[200px] md:w-1/2">
                <div className=" flex flex-col items-center justify-center gap-5 py-5">
                  <Skeleton className="h-14 w-[250px]" />
                  <Skeleton className="h-14 w-[280px]" />
                </div>
              </Box>
            </>
          )}
        </div>

        <div className="w-full">
          <TimeTrackerTable />
        </div>
      </div>
    </>
  )
}
export default TimeTracker

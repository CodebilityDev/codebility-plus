import TimeTrackerTable from "@/app/home/time-tracker/_components/time-tracker-table"
import H1 from "@/Components/shared/dashboard/H1"
import Box from "@/Components/shared/dashboard/Box"
import { excessHours, totalRenderedHours } from "@/app/home/time-tracker/_lib/dummy-data"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import { formatToLocaleTime } from "@/lib/format-date-time"

export default async function TimeTracker() {
  const supabase = getSupabaseServerComponentClient();
  const { data: { user }} = await supabase.auth.getUser();

  const { data, error } = await supabase.from('codev')
  .select(`
    start_time,
    end_time,
    time_log(*)  
  `).eq("user_id", user?.id)
  .single();

  const HoursSpent = {
    renderedHours: 0,
    excessHours: 0
  }

  if (data && data.time_log) {
    // sum all logs worked hours.
    HoursSpent.renderedHours = data.time_log.reduce((total, log) => total + log.worked_hours, 0).toFixed(2);
    // sum all logs excess hours.
    HoursSpent.excessHours = data.time_log.reduce((total, log) => total + log.excess_hours, 0).toFixed(2);
  }
  
  return (
    <div className="max-w-screen-xl mx-auto flex w-full flex-col justify-center gap-4">
      <H1>Time Logs</H1>

      <div className="flex flex-col gap-4 lg:flex-row">
        {data ? (
          <>
            <Box className="flex w-full min-h-[200px] flex-1 flex-col items-center gap-4 text-center md:flex-row lg:w-1/2">
              <Box className="w-full">
                <H1>{HoursSpent.renderedHours}</H1>
                <p className="text-gray">Rendered Hours </p>
              </Box>
              <Box className="w-full">
                <H1>{HoursSpent.excessHours} </H1>
                <p className="text-gray">Excess Hours</p>
              </Box>
            </Box>
            <Box className="flex min-h-[200px] flex-col items-center justify-center lg:w-1/2">
              <p className="text-gray">My Time Schedule</p>
              <H1 className="pt-2 text-2xl md:text-4xl">{formatToLocaleTime(data.start_time).split(",")[1]} - {formatToLocaleTime(data.end_time).split(",")[1]}</H1>
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
  )
}

import TimeTrackerTable from "@/app/home/time-tracker/_components/TimeTrackerTable";
import Box from "@/Components/shared/dashboard/Box";
import H1 from "@/Components/shared/dashboard/H1";
import { formatToLocaleTime } from "@/lib/format-date-time";
import { getCachedUser } from "@/lib/server/supabase-server-comp";
import { createClientServerComponent } from "@/utils/supabase/server";

import { TimeLog } from "./_types/time-log";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TimeTracker() {
  const supabase = await createClientServerComponent();
  const user = await getCachedUser();

  const { data, error } = await supabase
    .from("codev")
    .select(
      `
    start_time,
    end_time,
    time_log(
      *,
      worked_hours,
      excess_hours,
      task(
        *,
        project(
          name
        )
      )
    )  
  `,
    )
    .eq("user_id", user?.id)
    .single();

  const HoursSpent = {
    renderedHours: error ? "error" : "0",
    excessHours: error ? "error" : "0",
  };

  if (data && data.time_log) {
    // sum all logs worked hours.
    HoursSpent.renderedHours = data.time_log
      .reduce((total, log) => total + log.worked_hours, 0)
      .toFixed(2);
    // sum all logs excess hours.
    HoursSpent.excessHours = data.time_log
      .reduce((total, log) => total + log.excess_hours, 0)
      .toFixed(2);
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col justify-center gap-4">
      <H1>Time Logs</H1>

      <div className="flex flex-col gap-4 lg:flex-row">
        <Box className="flex min-h-[200px] w-full flex-1 flex-col items-center gap-4 text-center md:flex-row lg:w-1/2">
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
          {data && (
            <H1 className="pt-2 text-2xl md:text-4xl">
              {formatToLocaleTime(data.start_time).split(",")[1]} -{" "}
              {formatToLocaleTime(data.end_time).split(",")[1]}
            </H1>
          )}
        </Box>
      </div>

      <div className="w-full">
        <TimeTrackerTable timeLog={data?.time_log as TimeLog[]} />
      </div>
    </div>
  );
}

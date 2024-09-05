import { Box } from "@/Components/shared/dashboard";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { Task } from "@/types/home/task";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import { logUserTime } from "../actions";
import TimeTrackerSchedule from "./dashboard-time-tracker-schedule";
import TimeTrackerTimer from "./dashboard-time-tracker-timer";

export default async function TimeTracker() {
  const supabase = getSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("user")
    .select(
      `
    *,
    codev(
      id,
      codev_task(
        task(
          id,
          title,
          duration,
          points
        )
      ),
      start_time,
      end_time,
      task_timer_start_at,
      task(
        id
      )
    )
  `,
    )
    .eq("id", user?.id)
    .single();

  if (error)
    return (
      <Box className="flex-1">
        <div className="mx-auto flex flex-col items-center gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Box>
    );

  const tasks = data.codev.codev_task.map((item: { task: Task }) => item.task);
  const timerStartAt = data.codev.task_timer_start_at;
  const currentTaskId = data.codev.task && data.codev.task.id;

  // get how many seconds have passed since start at time.
  const timerInitialSecond =
    timerStartAt && (Date.now() - new Date(timerStartAt).getTime()) / 1000;

  return (
    <Box className="w-full flex-1">
      <form className="flex flex-col items-center gap-4" action={logUserTime}>
        <div>
          <p className="text-2xl">Time Tracker</p>
        </div>
        <input type="hidden" name="codevId" value={data.codev.id} />
        <div className="w-full">
          <p className="text-md text-gray text-center">My Time Schedule</p>
          <TimeTrackerSchedule
            codevId={data.codev.id}
            startTime={data.codev.start_time}
            endTime={data.codev.end_time}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <TimeTrackerTimer
            tasks={tasks}
            currentTaskId={currentTaskId}
            codevId={data.codev.id}
            timerInitialSecond={timerInitialSecond}
          />
        </div>
      </form>
    </Box>
  );
}

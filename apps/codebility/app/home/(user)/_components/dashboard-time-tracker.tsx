import { Box } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import TimeTrackerTimer from "./dashboard-time-tracker-timer";
import TimeTrackerSchedule from "./dashboard-time-tracker-schedule";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"

interface Task {
  title: string;
  duration: number;
  points: number;
}

export default async function TimeTracker() {
  const supabase = getSupabaseServerComponentClient();
  const { data: { user }} = await supabase.auth.getUser();

  const { data, error } = await supabase.from("user")
  .select(`
    *,
    codev(
      id,
      codev_task(
        task(
          title,
          duration,
          points
        )
      ),
      start_time,
      end_time,
      task_timer_start_at
    )
  `).eq("id", user?.id)
  .single();

  if (error) return <Box className="flex-1">
    <div className="mx-auto flex flex-col items-center gap-3">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  </Box>

  const tasks = data.codev.codev_task.map((item: { task: Task }) => item.task);
  const timerStartAt = data.codev.task_timer_start_at;

  // get how many seconds have passed since start at time.
  const timerInitialSecond = timerStartAt && ((Date.now() - new Date(timerStartAt).getTime()) / 1000);

  return (
    <>
      <Box className="flex w-full flex-1 flex-col items-center gap-4">
          <div>
            <p className="text-2xl">Time Tracker</p>
          </div>

          <div className="w-full">
            <p className="text-md text-center text-gray">My Time Schedule</p>
            <TimeTrackerSchedule codevId={data.codev.id} startTime={data.codev.start_time} endTime={data.codev.end_time} />
          </div>
          <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <Select>
              <SelectTrigger className="max-w-[300px] text-center">
                <SelectValue placeholder="Select Task" />
                <SelectContent>
                  {tasks.map((task: Task, index:number) =>
                    <SelectItem className="items-center" key={index} value={task.title}>
                        {task.title} - {task.duration && `${task.duration}h - `} {task.points}pts
                    </SelectItem>
                  )}
                </SelectContent>
              </SelectTrigger>
            </Select>
            <TimeTrackerTimer codevId={data.codev.id} timerInitialSecond={timerInitialSecond}/>
          </div>
      </Box>
    </>
  )
}
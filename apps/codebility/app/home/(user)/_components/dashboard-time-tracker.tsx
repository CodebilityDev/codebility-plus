"use client";

import { useState } from "react"
import { Box } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";
import useUser from "../../_hooks/use-user";
import TimeTrackerTimer from "./dashboard-time-tracker-timer";
import TimeTrackerSchedule from "./dashboard-time-tracker-schedule";

interface Task {
  title: string;
  duration: number;
  points: number;
}

export default function TimeTracker() {
  const user = useUser();
  const [selectedTask, setSelectedTask]: any = useState<Task | null>(null)

  const { data: TrackerTask, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["Tasks", "Kanban"],
    queryFn: async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error} = await supabase.from("codev_task")
      .select(
        `
          *,
          task(*)
        `
      )
      .eq("codev_id", user.codev_id);

      if (error) throw error;
      
      const tasks = data.map(item => item.task);
      return tasks;
    },
    refetchInterval: 3000,
  })

  return (
    <>
      { !tasksLoading ? (
        <Box className="flex w-full flex-1 flex-col items-center gap-4">
          <div>
            <p className="text-2xl">Time Tracker</p>
          </div>

          <div className="w-full">
            <p className="text-md text-center text-gray">My Time Schedule</p>
            <TimeTrackerSchedule codevId={user.codev_id} startTime={user.start_time} endTime={user.end_time} />
          </div>
          <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <Select
              onValueChange={(value) => {
                const task = TrackerTask?.find((t) => t.title === value)
                setSelectedTask(task)
              }}
            >
              <SelectTrigger className="max-w-[300px] text-center">
                <SelectValue placeholder="Select Task" />
                <SelectContent>
                  {TrackerTask?.map((task: Task, index:number) =>
                    <SelectItem className="items-center" key={index} value={task.title}>
                        {task.title} - {task.duration && `${task.duration}h - `} {task.points}pts
                    </SelectItem>
                  )}
                </SelectContent>
              </SelectTrigger>
            </Select>
            <TimeTrackerTimer />
          </div>
        </Box>
      ) : (
        <Box className="flex-1">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </Box>
      )}
    </>
  )
}
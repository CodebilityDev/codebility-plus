"use client";

import { useEffect, useState, useMemo, memo } from "react";
import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { Task } from "@/types/database";

import { logUserTime } from "../actions";
import TimeTrackerSchedule from "./DashboardTimeTrackerSchedule";
import TimeTrackerTimer from "./DashboardTimeTrackerTimer";

function TimeTracker() {
  const { user } = useUserStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/codev/${user.id}/tasks`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading || !data) {
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
  }

  const tasks = useMemo(() => 
    data.codev.codev_task.map((item: { task: Task }) => item.task)
  , [data.codev.codev_task]);
  
  const timerStartAt = data.codev.task_timer_start_at;
  const currentTaskId = data.codev.task?.id;

  const timerInitialSecond = useMemo(() =>
    timerStartAt && (Date.now() - new Date(timerStartAt).getTime()) / 1000
  , [timerStartAt]);

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

export default memo(TimeTracker);

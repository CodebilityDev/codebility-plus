"use client";

import { useMemo, memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { qk } from "@/lib/shared/query-keys";
import { Task } from "@/types/home/codev";

import { logUserTime } from "@/actions/dashboard/actions";
import TimeTrackerSchedule from "./DashboardTimeTrackerSchedule";
import TimeTrackerTimer from "./DashboardTimeTrackerTimer";

interface TimeTrackerPayload {
  codev: {
    id: string;
    start_time: number;
    end_time: number;
    task_timer_start_at: string | null;
    task: { id: string } | null;
    codev_task: { task: Task }[];
  };
}

async function fetchTimeTracker(codevId: string): Promise<TimeTrackerPayload> {
  const response = await fetch(`/api/codev/${codevId}/tasks`);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks (${response.status})`);
  }
  return response.json() as Promise<TimeTrackerPayload>;
}

function TimeTracker() {
  const userId = useUserStore((s) => s.user?.id ?? null);

  const { data } = useQuery({
    queryKey: qk.codevs.detail(userId ?? ""),
    queryFn: () => fetchTimeTracker(userId!),
    enabled: Boolean(userId),
  });

  if (!data) {
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

  const timerInitialSecond = useMemo(
    () =>
      timerStartAt ? (Date.now() - new Date(timerStartAt).getTime()) / 1000 : 0,
    [timerStartAt],
  );

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
            currentTaskId={currentTaskId ?? ""}
            codevId={data.codev.id}
            timerInitialSecond={timerInitialSecond}
          />
        </div>
      </form>
    </Box>
  );
}

export default memo(TimeTracker);

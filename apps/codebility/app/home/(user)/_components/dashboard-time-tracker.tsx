"use client";

import { useState, useEffect } from "react"
import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import { Box } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { TaskT } from "@/types"
import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";
import useUser from "../../_hooks/use-user";
import { formatToLocaleTime } from "@/lib/format-date-time";
import { useModal } from "@/hooks/use-modal";
import { useSchedule } from "@/hooks/use-timeavail";
import { formatLocaleTime, formatTime } from "../_lib/util";

interface Task {
  title: string;
}

export default function TimeTracker() {
  const user = useUser();
  const [selectedTask, setSelectedTask]: any = useState<TaskT | null>(null)
  const { onOpen } = useModal();
  const { time, clearTime, addTime} = useSchedule();

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

  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isTimerRunning])

  useEffect(() => {
    addTime({
      start_time: "",
      end_time: ""
    })
  }, [user.start_time, user.end_time]);

  const handleStartStopTimer = async () => {
    setIsTimerRunning(!isTimerRunning)
    if (isTimerRunning && selectedTask && user.id) {
      const taskDurationInSeconds = selectedTask?.duration * 3600
      const allowedTime = taskDurationInSeconds + 1800 // task duration + 30 minutes in seconds
      const userPoints = selectedTask.task_points
      let finalPoints = userPoints

      if (elapsedTime > allowedTime) {
        finalPoints = Math.floor(userPoints / 2)
      }

/*       await updateUserPoints(user.id, finalPoints) */
    }
  }

/*   const updateUserPoints = async (user.id: string, points: number) => {
    try {
      await axios.patch(`${API.USERS}/${user.id}`, { total_points: { FE: points } })
    } catch (error) {
      console.error("Error updating user points:", error)
    }
  }
 */
  return (
    <>
      { !tasksLoading ? (
        <Box className="flex w-full flex-1 flex-col items-center gap-4">
          <div>
            <p className="text-2xl">Time Tracker</p>
          </div>

          <div className="w-full">
            <p className="text-md text-center text-gray">My Time Schedule</p>
            <div className="flex items-center gap-2 justify-center">
              {user?.start_time && user?.end_time ? (
                <>
                  <p className="text-md">{`${formatLocaleTime(formatToLocaleTime(user.start_time).split(",")[1] as string)} - ${formatLocaleTime(formatToLocaleTime(user.end_time).split(",")[1] as string)}`}</p>
                  <div>
                    <Button variant="link" onClick={() => onOpen("scheduleModal")}>
                      <IconEdit className="invert dark:invert-0" />
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm">No time schedule set</p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <Select
              onValueChange={(value) => {
                const task = TrackerTask?.find((t) => t.title === value)
                setSelectedTask(task as any)
              }}
            >
              <SelectTrigger className="max-w-[300px] text-center">
                <SelectValue placeholder="Select Task" />
                <SelectContent>
                  {TrackerTask?.map((task: any, index:number) =>
                    <SelectItem className="items-center" key={index} value={task.title}>
                        {task.title} - {task.duration && `${task.duration}h - `} {task.points}pts
                    </SelectItem>
                  )}
                </SelectContent>
              </SelectTrigger>
            </Select>
            <p className="text-5xl font-bold">{formatTime(elapsedTime)}</p>
            <Button onClick={handleStartStopTimer}>{isTimerRunning ? "Stop Timer" : "Start Timer"}</Button>
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
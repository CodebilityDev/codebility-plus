import { useState, useEffect } from "react"
import useAuth from "@/hooks/use-auth"
import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import { Box } from "@/Components/shared/dashboard"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { dash_TimeTrackerT } from "@/types/protectedroutes"
import { TaskT } from "@/types"
import { getTasks } from "@/app/api/kanban"
import axios from "axios"
import { API } from "@/lib/constants"

const TimeTracker = () => {
  const { isLoading, userData } = useAuth()

  const [userId, setUserId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask]: any = useState<TaskT | null>(null)

  useEffect(() => {
    setUserId(userData?.id)
  }, [userData?.id])

  const { data: TrackerTask, isLoading: tasksLoading } = useQuery<dash_TimeTrackerT[]>({
    queryKey: ["Tasks", "Kanban"],
    queryFn: async () => {
      const response = await getTasks()
      return response.filter((task: TaskT) => task.userTask.some((userTask) => userTask.id === userId))
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

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartStopTimer = async () => {
    setIsTimerRunning(!isTimerRunning)
    if (isTimerRunning && selectedTask && userId) {
      const taskDurationInSeconds = selectedTask?.duration * 3600
      const allowedTime = taskDurationInSeconds + 1800 // task duration + 30 minutes in seconds
      const userPoints = selectedTask.task_points
      let finalPoints = userPoints

      if (elapsedTime > allowedTime) {
        finalPoints = Math.floor(userPoints / 2)
      }

      await updateUserPoints(userId, finalPoints)
    }
  }

  const updateUserPoints = async (userId: string, points: number) => {
    try {
      await axios.patch(`${API.USERS}/${userId}`, { total_points: { FE: points } })
    } catch (error) {
      console.error("Error updating user points:", error)
    }
  }

  return (
    <>
      {!isLoading && !tasksLoading ? (
        <Box className="flex w-full flex-1 flex-col items-center gap-4">
          <div>
            <p className="text-2xl">Time Tracker</p>
          </div>

          <div>
            <p className="text-md text-center text-gray">My Time Schedule</p>
            <div className="flex items-center gap-2">
              {userData?.start_time && userData?.end_time ? (
                <>
                  <p className="text-md">{`${userData?.start_time} - ${userData?.end_time}`}</p>
                  <Button variant="link">
                    <IconEdit className="invert dark:invert-0" />
                  </Button>
                </>
              ) : (
                <p className="text-sm">No time schedule set</p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
            <Select
              onValueChange={(value) => {
                const task = TrackerTask?.find((t) => t.name === value)
                setSelectedTask(task as any)
              }}
            >
              <SelectTrigger className="max-w-[300px] text-center">
                <SelectValue placeholder="Select Task" />
                <SelectContent>
                  {TrackerTask?.map((task: any) =>
                    task.userTask.map(() => (
                      <SelectItem className="items-center" key={task.id} value={task.title}>
                        {task.title} - {task.duration}h - {task.task_points}pts
                      </SelectItem>
                    ))
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

export default TimeTracker

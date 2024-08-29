"use client";

import { useEffect, useState } from "react";
import { formatTime } from "../_lib/util";
import { Button } from "@/Components/ui/button"
import { startUserTimer } from "../actions";

interface Props {
  codevId: string;
  timerInitialSecond: number;
}

export default function TimeTrackerTimer({ codevId, timerInitialSecond }: Props) {
  const initialSecondExists = timerInitialSecond !== null;
  const [isTimerRunning, setIsTimerRunning] = useState(initialSecondExists)
  const [elapsedTime, setElapsedTime] = useState(initialSecondExists ? Math.floor(timerInitialSecond): 0);

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

  const handleStartStopTimer = async () => {
    setIsTimerRunning(!isTimerRunning)

    if (!isTimerRunning) {
      await startUserTimer(codevId);
    }
/*     if (isTimerRunning && selectedTask && user.id) {
      const taskDurationInSeconds = selectedTask?.duration * 3600
      const allowedTime = taskDurationInSeconds + 1800 // task duration + 30 minutes in seconds
      const userPoints = selectedTask.task_points
      let finalPoints = userPoints

      if (elapsedTime > allowedTime) {
        finalPoints = Math.floor(userPoints / 2)
      }
 */
/*       await updateUserPoints(user.id, finalPoints) */
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
      <p className="text-5xl font-bold">{formatTime(elapsedTime)}</p>
      <Button 
        onClick={handleStartStopTimer}
        type={isTimerRunning ? "submit": "button"}
      >
        {isTimerRunning ? "Stop Timer" : "Start Timer"}
      </Button>
    </>
  )
}
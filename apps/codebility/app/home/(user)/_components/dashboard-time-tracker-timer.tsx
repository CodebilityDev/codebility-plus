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
      return;
    } 

    setIsTimerRunning(false);
    setElapsedTime(0);
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

  return (
    <>
      <p className="text-5xl font-bold">{formatTime(elapsedTime)}</p>
      {/* 
        I have swapped their type because when we start the timer (via clicking the start timer button),
        in start the start timer button type is button, when we clicked it (causing the timer to start and changing the button),
        the type changes to submit causing a submit instead of just a normal button click. 
        and when we clicked the stop timer button it acts as a normal button instead of submitting. 
        
        so my work around is to swapped their type start timer will be submitting,
        and stop timer will be a normal button type. idk why react do this.
        
        if you find a better way around this, please change it.
      */}
      {!isTimerRunning ? (
        <Button onClick={handleStartStopTimer} type="submit">
          Start Timer
        </Button>
      ) : (
        <Button onClick={handleStartStopTimer} type="button">
          Stop Timer
        </Button>
      )}
    </>
  )
}
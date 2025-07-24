"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task } from "@/types/home/codev";
import toast from "react-hot-toast";

import { formatTime } from "../_lib/util";
import { startUserTimer, updateUserTaskOnHand } from "../actions";

interface Props {
  tasks: Task[];
  codevId: string;
  timerInitialSecond: number;
  currentTaskId: string;
}

export default function TimeTrackerTimer({
  codevId,
  tasks,
  currentTaskId,
  timerInitialSecond,
}: Props) {
  const [taskOnHandId, setTaskOnHandId] = useState(currentTaskId);
  const initialSecondExists = timerInitialSecond !== null;
  const [isTimerRunning, setIsTimerRunning] = useState(initialSecondExists);
  const [elapsedTime, setElapsedTime] = useState(
    initialSecondExists ? Math.floor(timerInitialSecond) : 0,
  );

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isTimerRunning]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setElapsedTime(0);
  };

  const handleStartStopTimer = async () => {
    // if no task on hand we don't allow start/stop timer.
    if (!taskOnHandId) {
      toast.error("No Task Set");
      return;
    }

    setIsTimerRunning(!isTimerRunning);

    if (!isTimerRunning) {
      await startUserTimer(codevId);
      return;
    }

    resetTimer();
  };

  const handleTaskChange = async (taskId: string) => {
    setTaskOnHandId(taskId);

    try {
      await updateUserTaskOnHand(codevId, taskId);
      resetTimer();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Select
        name="taskId"
        value={taskOnHandId}
        onValueChange={handleTaskChange}
      >
        <SelectTrigger className="max-w-[300px] text-center">
          <SelectValue placeholder="Select Task" />
          <SelectContent>
            {/* {tasks.map((task: Task, index: number) => (
              <SelectItem className="items-center" key={index} value={task.id}>
                {task.title} - {task.duration && `${task.duration}h - `}{" "}
                {task.points}pts
              </SelectItem>
            ))} */}
          </SelectContent>
        </SelectTrigger>
      </Select>
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
  );
}

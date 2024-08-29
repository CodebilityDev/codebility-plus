"use client";

import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import { formatLocaleTime } from "../_lib/util";
import { useModal } from "@/hooks/use-modal";
import { useSchedule } from "@/hooks/use-timeavail";
import { useEffect, useState } from "react";
import { formatToLocaleTime } from "@/lib/format-date-time";
import { updateUserSchedule } from "../actions";

interface Props {
  startTime: number;
  endTime: number;
  codevId: string;
}

export default function TimeTrackerSchedule({ startTime, endTime, codevId }: Props) {
  const { onOpen } = useModal();  

  const { time, addTime } = useSchedule();
  const [isMounted, setIsMounted] = useState(false);
  const [currentStartTime, setStartTime] = useState(formatToLocaleTime(startTime).split(",")[1]?.trim() as string); // get locale time (hh:mm AM|PM)
  const [currentEndTime, setEndTime] = useState(formatToLocaleTime(endTime).split(",")[1]?.trim() as string);

  useEffect(() => {
    addTime({
      start_time: currentStartTime,
      end_time: currentEndTime
    })
  }, [startTime, endTime]);
  
  useEffect(() => {
    if (isMounted) {
      setStartTime(time.start_time);
      setEndTime(time.end_time);

      // a server action but don't have to await since we used state to display changes.
      updateUserSchedule({
        startTime: currentStartTime,
        endTime: currentEndTime
      }, codevId);
    }
    
    return () => {
      setIsMounted(true);
    }
  }, [time.start_time, time.end_time]);
  
  return (
    <div className="flex items-center gap-2 justify-center">
      {startTime && endTime ? (
        <>
          <p className="text-md">{`${formatLocaleTime(currentStartTime)} - ${formatLocaleTime(currentEndTime)}`}</p>
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
  )
}
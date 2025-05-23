"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useSchedule } from "@/hooks/use-timeavail";
import { formatToLocaleTime } from "@/lib/format-date-time";
import { IconEdit } from "@/public/assets/svgs";

import { formatLocaleTime } from "../_lib/util";
import { updateUserSchedule } from "../actions";
import React from "react";

interface Props {
  startTime: number;
  endTime: number;
  codevId: string;
}

export default function TimeTrackerSchedule({
  startTime,
  endTime,
  codevId,
}: Props) {
  const { onOpen } = useModal();

  const { time, addTime } = useSchedule();
  const [isMounted, setIsMounted] = useState(false);
  const [currentStartTime, setStartTime] = useState(
    formatToLocaleTime(startTime).split(",")[1]?.trim() as string,
  ); // get locale time (hh:mm AM|PM)
  const [currentEndTime, setEndTime] = useState(
    formatToLocaleTime(endTime).split(",")[1]?.trim() as string,
  );

  useEffect(() => {
    addTime({
      start_time: currentStartTime,
      end_time: currentEndTime,
    });
  }, [startTime, endTime, addTime, currentEndTime, currentStartTime]);

  useEffect(() => {
    if (isMounted) {
      setStartTime(time.start_time);
      setEndTime(time.end_time);

      try {
        // a server action but don't have to await since we used state to display changes.
        updateUserSchedule(
          {
            startTime: time.start_time,
            endTime: time.end_time,
          },
          codevId,
        );
      } catch (e: any) {
        console.log(e.message);
      }
    }

    return () => {
      setIsMounted(true);
    };
  }, [time.start_time, time.end_time]);

  return (
    <div className="flex items-center justify-center gap-2">
      {currentStartTime && currentEndTime ? (
        <>
          <p className="text-md">{`${formatLocaleTime(currentStartTime)} - ${formatLocaleTime(currentEndTime)}`}</p>
          <div>
            <Button variant="link" onClick={() => onOpen("scheduleModal")}>
              <Image
                src={IconEdit}
                alt="Edit schedule"
                className="invert dark:invert-0"
                width={16}
                height={16}
              />
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm">No time schedule set</p>
      )}
    </div>
  );
}

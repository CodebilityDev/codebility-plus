"use client";

import * as React from "react";
import { TimePeriodSelect } from "@/components/applicant/profile/PeriodSelect";
import { TimePickerInput } from "@/components/applicant/profile/TimePickerInput";
import { Period } from "@/types/applicant/profile/profile";

import { Label } from "@codevs/ui/label";
import type { TimePickerProps } from "@/types/applicant/profile/profile";


export function TimePicker12({
  date,
  setDate,
  period,
  disabled = false,
}: TimePickerProps) {
  const [currentPeriod, setCurrentPeriod] = React.useState<Period>(period);

  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  const periodRef = React.useRef<HTMLButtonElement>(null);
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="min:w-[48px] flex h-full flex-col justify-between text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="12hours"
          period={period}
          date={date}
          setDate={handleDateChange}
          ref={hourRef}
          disabled={disabled}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="min:w-[48px] flex h-full flex-col justify-between text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={handleDateChange}
          ref={minuteRef}
          disabled={disabled}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>

      <div className="min:w-[48px] flex h-full flex-col justify-between text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <TimePeriodSelect
          period={currentPeriod}
          setPeriod={setCurrentPeriod}
          date={date}
          setDate={handleDateChange}
          ref={periodRef}
          disabled={disabled}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
    </div>
  );
}

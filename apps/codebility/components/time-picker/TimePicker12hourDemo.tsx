"use client";

import * as React from "react";
import { TimePeriodSelect } from "@/components/time-picker/PeriodSelect";
import { TimePickerInput } from "@/components/time-picker/TimePickerInput";
import { Period } from "@/components/time-picker/TimePickerUtils";

import { Label } from "@codevs/ui/label";

interface TimePickerProps {
  date?: Date;
  period: Period;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

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

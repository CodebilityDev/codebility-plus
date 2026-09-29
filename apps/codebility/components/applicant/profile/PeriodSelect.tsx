"use client";

import * as React from "react";
import type { Period } from "@/types/applicant/profile/profile";
import { display12HourValue, setDateByType } from "@/utils/applicant/profile/profile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/global/ui/select";
import type { PeriodSelectorProps } from "@/types/applicant/profile/profile";


export const TimePeriodSelect = React.forwardRef<
  HTMLButtonElement,
  PeriodSelectorProps
>(
  (
    { period, setPeriod, date, setDate, onLeftFocus, onRightFocus, disabled },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
    };

    const handleValueChange = (value: Period) => {
      setPeriod(value);

      /**
       * trigger an update whenever the user switches between AM and PM;
       * otherwise user must manually change the hour each time
       */
      if (date) {
        const tempDate = new Date(date);
        const hours = display12HourValue(date.getHours());
        const newDate = setDateByType(
          tempDate,
          hours.toString(),
          "12hours",
          value,
        );

        setDate(newDate);
      }
    };

    return (
      <Select
        disabled={disabled}
        defaultValue={period}
        onValueChange={(value: Period) => handleValueChange(value)}
      >
        <SelectTrigger
          ref={ref}
          className="background-box w-[48px] rounded-sm border-none p-3 text-center text-sm focus:bg-accent focus:text-accent-foreground lg:py-2"
          onKeyDown={handleKeyDown}
          isArrow={false}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    );
  },
);

TimePeriodSelect.displayName = "TimePeriodSelect";

"use client"

import * as React from "react"

import { Period, display12HourValue, setDateByType } from "@/Components/time-picker/time-picker-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"

export interface PeriodSelectorProps {
  period: Period
  // eslint-disable-next-line no-unused-vars
  setPeriod: (m: Period) => void
  date: Date | undefined
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Date | undefined) => void
  onRightFocus?: () => void
  onLeftFocus?: () => void
  disabled?: boolean
}

export const TimePeriodSelect = React.forwardRef<HTMLButtonElement, PeriodSelectorProps>(
  ({ period, setPeriod, date, setDate, onLeftFocus, onRightFocus, disabled }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") onRightFocus?.()
      if (e.key === "ArrowLeft") onLeftFocus?.()
    }

    const handleValueChange = (value: Period) => {
      setPeriod(value)

      /**
       * trigger an update whenever the user switches between AM and PM;
       * otherwise user must manually change the hour each time
       */
      if (date) {
        const tempDate = new Date(date)
        const hours = display12HourValue(date.getHours())
        const newDate = setDateByType(tempDate, hours.toString(), "12hours", value);

        setDate(newDate);
      }
    }

    return (
      <div className="flex h-10 items-center">
        <Select disabled={disabled} defaultValue={period} onValueChange={(value: Period) => handleValueChange(value)}>
          <SelectTrigger
            ref={ref}
            className="background-box w-[65px] focus:bg-accent focus:text-accent-foreground"
            onKeyDown={handleKeyDown}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }
)

TimePeriodSelect.displayName = "TimePeriodSelect"
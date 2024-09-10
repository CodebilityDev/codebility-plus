"use client";

import * as React from "react"
import { TimePicker12 } from "@/Components/time-picker/time-picker-12hour-demo"

export function TimePicker12HourWrapper() {
  const [date, setDate] = React.useState<Date>()
  return <TimePicker12 setDate={setDate} date={date} />
}

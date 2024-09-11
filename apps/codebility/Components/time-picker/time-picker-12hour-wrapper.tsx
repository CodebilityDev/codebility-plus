"use client";

import * as React from "react"
import { TimePicker12 } from "@/Components/time-picker/time-picker-12hour-demo"
import { TimePickerDemo } from "./time-picker-demo";

export function TimePicker12HourWrapper() {
  const [date, setDate] = React.useState<Date>()
  return <TimePickerDemo setDate={setDate} date={date} />
}

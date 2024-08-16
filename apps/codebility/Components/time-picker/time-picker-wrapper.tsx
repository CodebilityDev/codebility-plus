"use client"

import * as React from "react"
import { TimePickerDemo } from "@/Components/time-picker/time-picker-demo" 

export function TimePickerWrapper() {
  const [date, setDate] = React.useState<Date>()
  return <TimePickerDemo setDate={setDate} date={date} />
}

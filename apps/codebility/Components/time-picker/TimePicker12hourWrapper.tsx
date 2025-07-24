"use client";

import * as React from "react";
import { TimePicker12 } from "@/components/time-picker/TimePicker12hourDemo";

import { TimePickerDemo } from "./TimePickerDemo";

export function TimePicker12HourWrapper() {
  const [date, setDate] = React.useState<Date>();
  return <TimePickerDemo setDate={setDate} date={date} />;
}

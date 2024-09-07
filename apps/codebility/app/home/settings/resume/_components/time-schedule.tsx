"use client"
import { useEffect, useState } from "react"
import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import { Box } from "@/Components/shared/dashboard"
import { Paragraph } from "@/Components/shared/home"
import { updateProfile } from "../action"

import toast from "react-hot-toast"
import { Period } from "@/Components/time-picker/time-picker-utils"
import { TimePicker12 } from "@/Components/time-picker/time-picker-12hour-demo"

interface TimeScheduleProps {
  startTime?: string
  endTime?: string
}
const TimeSchedule = ({ startTime = "", endTime = "" }: TimeScheduleProps) => {
  const [start, setStart] = useState(startTime)
  const [end, setEnd] = useState(endTime)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const { date } = parseTime(startTime);
    setStart(date.toTimeString().substring(0, 5));
    
  }, [startTime]);
  useEffect(() => {
    const { date} = parseTime(endTime);
    setEnd(date.toTimeString().substring(0, 5));
 
  }, [endTime]);
  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }
  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ start_time: start, end_time: end });
      toast.success("Schedule updated successfully!");
    } catch (error) {
      toast.error("Error updating schedule");
    } finally {
      setIsEditMode(false);
      setIsLoading(false);
    }
  };
  const parseTime = (timeStr: string): { date: Date, period: Period } => {
    if (!timeStr) {
      const now = new Date()
      const period = now.getHours() >= 12 ? "PM" : "AM"
      return { date: now, period }
    }
  
    const [hours, minutes]: any = timeStr.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
  
    const period = parseInt(hours, 10) >= 12 ? "PM" : "AM"
    return { date, period }
  }
  
  
  return (
    <Box className="relative flex flex-col gap-2 bg-light-900 dark:bg-dark-100">
      <IconEdit
        className="w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        onClick={handleEditClick}
      />
      <p className="text-lg">My Time Schedule</p>
      <Paragraph className="py-4">
        Update your time schedule here. This will help us to monitor your working hours.
      </Paragraph>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
          <p className="text-lg">Start Time</p>
          
          <TimePicker12
  disabled={!isEditMode} 
  setDate={(date) => setStart(date ? date.toTimeString().substring(0, 5) : "")}
  date={parseTime(start).date}
  period={parseTime(start).period}
/>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
          <p className="text-lg">End Time</p>
          <TimePicker12
  disabled={!isEditMode} 
  setDate={(date) => setEnd(date ? date.toTimeString().substring(0, 5) : "")}
  date={parseTime(end).date}
  period={parseTime(end).period}
/>
           
        </div>
      </div>
      {isEditMode ? (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="hollow" onClick={handleSaveClick} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="default" type="submit" onClick={handleSaveClick} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : null}
    </Box>
  )
}

export default TimeSchedule
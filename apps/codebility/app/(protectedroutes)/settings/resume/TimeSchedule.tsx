import { useState } from "react"

import { Button } from "@/Components/ui/button"
import { IconEdit } from "@/public/assets/svgs"
import { Box } from "@/Components/shared/dashboard"
import { Paragraph } from "@/Components/shared/home"
import { TimePicker12HourWrapper } from "@/Components/time-picker/time-picker-12hour-wrapper"

const TimeSchedule = () => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLoading] = useState(false)

  const handleEditClick = () => {
    setIsEditMode(!isEditMode)
  }

  const handleSaveClick = () => {
    setIsEditMode(false)
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
          <TimePicker12HourWrapper />
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
          <p className="text-lg">End Time</p>
          <TimePicker12HourWrapper />
        </div>
      </div>
      {isEditMode ? (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="hollow" onClick={handleSaveClick} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="default" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : null}
    </Box>
  )
}

export default TimeSchedule

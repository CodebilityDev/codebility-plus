"use client";

import { useEffect, useState } from "react";
import { Box } from "@/Components/shared/dashboard";
import { Paragraph } from "@/Components/shared/home";
import { TimePicker12 } from "@/Components/time-picker/time-picker-12hour-demo";
import { Period } from "@/Components/time-picker/time-picker-utils";
import { Button } from "@/Components/ui/button";
import { IconEdit } from "@/public/assets/svgs";
import toast from "react-hot-toast";

import { Profile_Types } from "../_types/resume";
import { updateProfile } from "../action";

interface TimeScheduleProps {
  data: Profile_Types;
}
const TimeSchedule = ({ data }: TimeScheduleProps) => {
  const [start, setStart] = useState(data?.start_time || "");
  const [end, setEnd] = useState(data?.end_time || "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { date } = parseTime(data?.start_time || "");
    setStart(date.toTimeString().substring(0, 5));
  }, [data?.start_time]);
  useEffect(() => {
    const { date } = parseTime(data?.end_time || "");
    setEnd(date.toTimeString().substring(0, 5));
  }, [data?.end_time]);
  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };
  const handleSaveClick = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Your time schedule was being updated");
    try {
      await updateProfile({ start_time: start, end_time: end });
      toast.success("Schedule updated successfully!", { id: toastId });
    } catch (error) {
      toast.error("Error updating schedule");
    } finally {
      setIsEditMode(false);
      setIsLoading(false);
    }
  };
  const parseTime = (timeStr: string): { date: Date; period: Period } => {
    if (!timeStr) {
      const now = new Date();
      const period = now.getHours() >= 12 ? "PM" : "AM";
      return { date: now, period };
    }

    const [hours, minutes]: any = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const period = parseInt(hours, 10) >= 12 ? "PM" : "AM";
    return { date, period };
  };

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <IconEdit
        className="w-15 h-15 absolute right-6 top-6 cursor-pointer invert dark:invert-0"
        onClick={handleEditClick}
      />
      <p className="text-lg">My Time Schedule</p>
      <Paragraph className="py-4">
        Update your time schedule here. This will help us to monitor your
        working hours.
      </Paragraph>
      <div className="flex flex-col gap-6 sm:flex-row md:flex-col 2xl:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
          <p className="text-lg">Start Time</p>

          <TimePicker12
            disabled={!isEditMode}
            setDate={(date) =>
              setStart(date ? date.toTimeString().substring(0, 5) : "")
            }
            date={parseTime(start).date}
            period={parseTime(start).period}
          />
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
          <p className="text-lg">End Time</p>
          <TimePicker12
            disabled={!isEditMode}
            setDate={(date) =>
              setEnd(date ? date.toTimeString().substring(0, 5) : "")
            }
            date={parseTime(end).date}
            period={parseTime(end).period}
          />
        </div>
      </div>
      {isEditMode ? (
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="hollow"
            onClick={handleSaveClick}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            type="submit"
            onClick={handleSaveClick}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : null}
    </Box>
  );
};

export default TimeSchedule;

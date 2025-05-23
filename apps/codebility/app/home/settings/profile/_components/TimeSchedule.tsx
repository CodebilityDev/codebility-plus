"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@/Components/shared/dashboard";
import { Paragraph } from "@/Components/shared/home";
import { TimePicker12 } from "@/Components/time-picker/TimePicker12hourDemo";
import { Period } from "@/Components/time-picker/TimePickerUtils";
import { Button } from "@/Components/ui/button";
import { IconEdit } from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
import {
  DayOfWeek,
  DAYS_OF_WEEK,
  WEEKDAYS,
  WorkSchedule,
} from "@/types/home/codev";
import toast from "react-hot-toast";

import { Checkbox } from "@codevs/ui/checkbox";
import { Label } from "@codevs/ui/label";

import { updateWorkSchedule } from "../action";

interface TimeScheduleProps {
  data?: WorkSchedule | null;
}

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "17:00";

const TimeSchedule = ({ data }: TimeScheduleProps) => {
  const { user } = useUserStore();

  const [schedule, setSchedule] = useState<WorkSchedule>(() => ({
    id: data?.id ?? "",
    codev_id: user?.id ?? "",
    days_of_week: data?.days_of_week ?? [],
    start_time: data?.start_time ?? DEFAULT_START_TIME,
    end_time: data?.end_time ?? DEFAULT_END_TIME,
  }));

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setSchedule((prev) => ({ ...prev, codev_id: user.id }));
    }
  }, [user]);

  const parseTime = (timeStr: string): { date: Date; period: Period } => {
    if (!timeStr || timeStr === "") {
      const date = new Date();
      date.setHours(9, 0, 0);
      return { date, period: "AM" };
    }

    try {
      const [hours, minutes] = timeStr.split(":").map(Number);
      const date = new Date();
      date.setHours(hours || 9, minutes || 0, 0);
      return {
        date,
        period: (hours || 9) >= 12 ? "PM" : "AM",
      };
    } catch (error) {
      console.error("Error parsing time:", error);
      const date = new Date();
      date.setHours(9, 0, 0);
      return { date, period: "AM" };
    }
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setSchedule((prev) => {
      const newDays = prev.days_of_week.includes(day)
        ? prev.days_of_week.filter((d) => d !== day)
        : [...prev.days_of_week, day];

      return {
        ...prev,
        days_of_week: newDays,
      };
    });
  };

  const handleTimeChange = (
    field: "start_time" | "end_time",
    value: string,
  ) => {
    if (!value) return; // Don't update if value is empty

    setSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = async () => {
    if (schedule.days_of_week.length === 0) {
      toast.error("Please select at least one working day");
      return;
    }

    if (!schedule.start_time || !schedule.end_time) {
      toast.error("Please set both start and end times");
      return;
    }

    const [startHour, startMinute] = schedule.start_time.split(":").map(Number);
    const [endHour, endMinute] = schedule.end_time.split(":").map(Number);

    if (
      endHour! < startHour! ||
      (endHour === startHour && endMinute! <= startMinute!)
    ) {
      toast.error("End time must be after start time");
      return;
    }

    const toastId = toast.loading("Updating your schedule...");
    setIsLoading(true);

    try {
      const scheduleData = {
        codev_id: schedule.codev_id,
        days_of_week: schedule.days_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      };

      console.log("scheduleData:", scheduleData);
      await updateWorkSchedule(scheduleData);
      toast.success("Schedule updated successfully!", { id: toastId });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectWeekdays = () => {
    setSchedule((prev) => ({
      ...prev,
      days_of_week:
        prev.days_of_week.length === WEEKDAYS.length ? [] : [...WEEKDAYS],
    }));
  };

  const handleCancel = () => {
    setSchedule({
      id: data?.id ?? "",
      codev_id: user?.id ?? "",
      days_of_week: data?.days_of_week ?? [],
      start_time: data?.start_time ?? DEFAULT_START_TIME,
      end_time: data?.end_time ?? DEFAULT_END_TIME,
    });
    setIsEditMode(false);
  };

  return (
    <Box className="bg-light-900 dark:bg-dark-100 relative flex flex-col gap-2">
      <Image
        src={IconEdit}
        alt="Edit"
        className={`$
          {isEditMode
            ? "hidden"
            : "h-15 w-15 dark:invert-0" } absolute right-6 top-6 cursor-pointer
        invert`}
        onClick={() => setIsEditMode(true)}
      />

      <p className="text-lg">My Time Schedule</p>
      <Paragraph className="py-4">
        Update your work schedule by selecting your working days and setting
        your hours. This helps us monitor your working hours.
      </Paragraph>

      <div className="mb-4">
        <Label className="mb-2 block">Working Days</Label>
        <div className="grid grid-cols-2 gap-2 ">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="flex min-w-[120px] items-center gap-2 rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Checkbox
                id={day}
                checked={schedule.days_of_week.includes(day)}
                onCheckedChange={() => handleDayToggle(day)}
                disabled={!isEditMode}
              />
              <Label
                htmlFor={day}
                className="cursor-pointer text-sm font-medium"
              >
                {day}
              </Label>
            </div>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          onClick={handleSelectWeekdays}
          disabled={!isEditMode}
          className="mt-2 text-xs"
        >
          {schedule.days_of_week.length === WEEKDAYS.length
            ? "Clear Weekdays"
            : "Select Weekdays"}
        </Button>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row md:flex-col 2xl:flex-row">
        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
          <p className="text-lg">Start Time</p>
          <TimePicker12
            disabled={!isEditMode}
            setDate={(date) => {
              const timeStr = date ? date.toTimeString().substring(0, 5) : "";
              handleTimeChange("start_time", timeStr);
            }}
            date={parseTime(schedule.start_time).date}
            period={parseTime(schedule.start_time).period}
          />
        </div>

        <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
          <p className="text-lg">End Time</p>
          <TimePicker12
            disabled={!isEditMode}
            setDate={(date) => {
              const timeStr = date ? date.toTimeString().substring(0, 5) : "";
              handleTimeChange("end_time", timeStr);
            }}
            date={parseTime(schedule.end_time).date}
            period={parseTime(schedule.end_time).period}
          />
        </div>
      </div>

      {schedule.days_of_week.length > 0 && !isEditMode && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium">Current Schedule:</h3>
          <div className="rounded-lg border border-zinc-700 p-4">
            <p className="mb-2">
              <span className="font-medium">Working Days:</span>{" "}
              {schedule.days_of_week.join(", ")}
            </p>
            <p>
              <span className="font-medium">Hours:</span> {schedule.start_time}{" "}
              - {schedule.end_time}
            </p>
          </div>
        </div>
      )}

      {isEditMode && (
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="hollow" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSaveClick}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default TimeSchedule;

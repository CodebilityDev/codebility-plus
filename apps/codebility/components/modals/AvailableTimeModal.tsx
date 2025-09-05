import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ScheduleType, useSchedule } from "@/hooks/use-timeavail";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AvailableTimeModal = () => {
  const { isOpen, onClose, type } = useModal();
  const [time, setTime] = useState<ScheduleType>({
    start_time: "",
    end_time: "",
  });

  const { addTime, clearTime, time: newTime } = useSchedule();

  function convertTo24HourFormat(time12: string): string {
    const [time, period]: string[] = time12.split(" ");
    const [hours, minutes]: string[] = (time || "").split(":");

    let hours24: number = parseInt(hours || "", 10);

    if (period === "PM" && hours24 !== 12) {
      hours24 += 12;
    } else if (period === "AM" && hours24 === 12) {
      hours24 = 0;
    }

    const hours24Formatted: string = String(hours24).padStart(2, "0");
    const minutesFormatted: string = String(minutes).padStart(2, "0");

    return `${hours24Formatted}:${minutesFormatted}`;
  }

  function convertTo12HourFormat(
    time24: string,
    type: "start_time" | "end_time",
  ) {
    const timeObj = new Date(`2022-01-01T${time24}`);
    const hours = timeObj.getHours();
    const minutes = timeObj.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

    switch (type) {
      case "start_time":
        setTime((prev) => ({
          ...prev,
          start_time: `${hours12}:${minutesFormatted} ${period}`,
        }));
        break;
      case "end_time":
        setTime((prev) => ({
          ...prev,
          end_time: `${hours12}:${minutesFormatted} ${period}`,
        }));
        break;
      default:
        return null;
    }
  }
  const isModalOpen = isOpen && type === "scheduleModal";

  useEffect(() => {
    if (isModalOpen) {
      setTime(newTime);
    }
  }, [isModalOpen, newTime]);

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="bg-black-100 w-[90%] flex max-w-[30rem] flex-col gap-8 overflow-y-auto p-6 text-white lg:p-12"
      >
        <DialogHeader>
          <DialogTitle className="text-md text-center font-normal md:text-2xl">
            What is your available time with us?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-center gap-2">
            <label
              htmlFor="start_time"
              className="md:text-md w-40 text-sm lg:text-lg"
            >
              Starting Time
            </label>
            <input
              onChange={(e) =>
                convertTo12HourFormat(e.target.value, "start_time")
              }
              className="text-black-500 w-40 cursor-text bg-transparent p-2 text-lg outline-none invert"
              type="time"
              id="start_time"
              value={convertTo24HourFormat(time.start_time)}
            />
          </div>

          <div className="flex h-10 items-center justify-center gap-2">
            <label
              htmlFor="end_time"
              className="md:text-md w-40 text-sm lg:text-lg"
            >
              End Time
            </label>
            <input
              onChange={(e) =>
                convertTo12HourFormat(e.target.value, "end_time")
              }
              className="text-black-500 w-40 cursor-text bg-transparent p-2 text-lg outline-none invert"
              type="time"
              id="end_time"
              value={convertTo24HourFormat(time.end_time)}
            />
          </div>
        </div>

        <DialogFooter className="mt-2 flex gap-2">
          <Button
            onClick={() => {
              clearTime();
              setTime((prev) => ({ ...prev, start_time: "", end_time: "" }));
            }}
            variant="link"
            className="w-full text-white hover:text-customBlue-100"
          >
            Clear
          </Button>
          <Button
            onClick={() => {
              if (time.start_time || time.end_time) addTime(time);
              onClose();
            }}
            variant="default"
            className="w-full"
            disabled={!time.start_time || !time.end_time}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailableTimeModal;

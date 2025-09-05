import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { ScheduleType, useSchedule } from "@/hooks/use-timeavail";

import { Dialog, DialogContent, DialogTitle } from "@codevs/ui/dialog";

const AvailableTimeModal = () => {
  const { isOpen, onClose, type } = useModal();
  const [time, setTime] = useState<ScheduleType>({
    start_time: "",
    end_time: "",
  });

  const { addTime, clearTime, time: newTime } = useSchedule();

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
      <DialogContent className="bg-black-100 flex max-w-[36rem] flex-col gap-6 overflow-y-auto p-10 text-white">
        <DialogTitle className="sr-only">Available Time</DialogTitle>
        <p className="text-md text-center font-normal md:text-lg lg:text-2xl">
          What is your available intern time with us?
        </p>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
            <p className="text-lg">Start Time</p>
            
          </div>
          <div className="flex flex-1 flex-col items-center gap-4 rounded-lg border border-zinc-700 p-6">
            <p className="text-lg">End Time</p>
          
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              clearTime();
              setTime((prev) => ({ ...prev, start_time: "", end_time: "" }));
            }}
            variant="hollow"
            className="w-full"
          >
            Reset
          </Button>
          <Button
            onClick={() => {
              if (time.start_time || time.end_time) addTime(time);
              onClose();
            }}
            variant="default"
            className="w-full"
            disabled={!time.start_time || !time.end_time ? true : false}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailableTimeModal;

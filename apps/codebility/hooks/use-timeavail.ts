import { create } from "zustand";

export interface ScheduleType {
  start_time: string;
  end_time: string;
}

interface Schedule {
  time: ScheduleType;
  addTime: (iTime: ScheduleType) => void;
  clearTime: () => void;
}

export const useSchedule = create<Schedule>((set) => ({
  time: {
    start_time: "",
    end_time: "",
  },
  addTime: (iTime) => set((state) => ({ ...state.time, time: iTime })),
  clearTime: () =>
    set((state) => ({
      ...state.time,
      time: {
        start_time: "",
        end_time: "",
      },
    })),
}));

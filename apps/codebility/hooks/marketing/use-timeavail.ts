import { create } from "zustand";
import type { Schedule } from "@/types/marketing/marketing";


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

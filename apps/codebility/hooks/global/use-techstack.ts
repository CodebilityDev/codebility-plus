import { create } from "zustand";
import type { TechStack } from "@/types/global/hooks";


export const useTechStackStore = create<TechStack>((set, get) => ({
  stack: [],
  nonTech: false,
  addRemoveStack: (tech) =>
    set((state) => {
      const isObjectInArray = state.stack.some((obj) => {
        return JSON.stringify(obj) === JSON.stringify(tech);
      });
      if (isObjectInArray) {
        return {
          stack: state.stack.filter(
            (obj) => JSON.stringify(obj) !== JSON.stringify(tech),
          ),
        };
      } else {
        return { stack: [...state.stack, tech] };
      }
    }),
  clearStack: () => set(() => ({ stack: [] })),
  setStack: (i) => set(() => ({ stack: i })),
  setNonTech: () => {
    get().clearStack();
    set((state) =>
      state.nonTech === false
        ? { nonTech: true, stack: ["none"] }
        : { nonTech: false, stack: [] },
    );
  },
}));

import { create } from "zustand";

interface TechStack {
  stack: string[];
  addRemoveStack: (tech: string) => void;
  clearStack: () => void;
  setStack: (i: string[]) => void;
}

export const useTechStackStore = create<TechStack>((set) => ({
  stack: [],
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
  clearStack: () => set((state) => ({ stack: [] })),
  setStack: (i) => set((state) => ({ stack: i })),
}));

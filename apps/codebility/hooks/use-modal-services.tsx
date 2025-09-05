import { Project } from "@/types/home/codev";
import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  modalContent: Project | null;
  openModal: (content: Project) => void;
  closeModal: () => void;
};

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  modalContent: null,
  openModal: (content) => {
    try {
      set({ isOpen: true, modalContent: content });
    } catch (error) {
      console.error("Error in openModal:", error);
    }
  },
  closeModal: () => {
    try {
      console.log("closeModal called");
      set({ isOpen: false, modalContent: null });
    } catch (error) {
      console.error("Error in closeModal:", error);
    }
  },
}));

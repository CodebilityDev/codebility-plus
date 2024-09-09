import { ServiceCardT } from "@/types";
import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  modalContent: ServiceCardT | null;
  openModal: (content: ServiceCardT) => void;
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

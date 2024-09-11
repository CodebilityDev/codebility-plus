import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants";
import { create } from "zustand";

export type ModalType = "applicantsAddModal" | "applicantsEditModal";

interface ModalStore {
    type: ModalType | null;
    data?: ApplicantsList_Types;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ApplicantsList_Types) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type: ModalType, data?: ApplicantsList_Types) =>
        set({ isOpen: true, type, data }),
    onClose: () => set({ type: null, isOpen: false }),
}));

import { TaskT } from "@/types";
import { client_ClientCardT } from "@/types/protectedroutes";
import { create } from "zustand";

export type ModalType =
  | "companyProfile"
  | "termsAndCondition"
  | "privacyPolicy"
  | "techStackModal"
  | "scheduleModal"
  | "taskAddModal"
  | "taskViewModal"
  | "taskViewEditModal"
  | "contactUsModal"
  | "privacyPolicyModal"
  | "termsOfServiceModal"
  | "timeTrackerTicketModal"
  | "listAddModal"
  | "boardAddModal"
  | "homeTermsAndConditionModal"
  | "homeFAQSModal"
  | "homePrivacyPolicyModal"
  | "addRoleModal"
  | "editRoleModal"
  | "deleteRoleModal";

interface ModalStore {
  type: ModalType | null;
  data?: TaskT | client_ClientCardT[] | any;
  dataObject?: any;
  isOpen: boolean;
  onOpen: (
    type: ModalType,
    data?: TaskT | client_ClientCardT[] | any,
    dataObject?: any,
  ) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  dataObject: {},
  isOpen: false,
  onOpen: (type, data?: TaskT | client_ClientCardT[] | any, dataObject?) =>
    set({ isOpen: true, type, data, dataObject }),
  onClose: () => set({ type: null, isOpen: false }),
}));

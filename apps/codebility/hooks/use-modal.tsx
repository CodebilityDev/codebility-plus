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
  | "taskEditModal"
  | "taskDeleteModal"
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
  | "deleteRoleModal"
  | "deleteWarningModal";

interface ModalStore {
  type: ModalType | null;
  data?: TaskT | client_ClientCardT[] | any;
  dataObject?: any;
  callback?: () => void;
  isOpen: boolean;
  onOpen: (
    type: ModalType,
    data?: TaskT | client_ClientCardT[] | any,
    dataObject?: any,
    callback?: () => void,
  ) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  dataObject: {},
  isOpen: false,
  callback: undefined,
  onOpen: (
    type,
    data?: TaskT | client_ClientCardT[] | any,
    dataObject?,
    callback?,
  ) => set({ isOpen: true, type, data, dataObject, callback }),
  onClose: () => set({ type: null, isOpen: false, callback: undefined }),
}));

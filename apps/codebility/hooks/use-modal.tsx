import { Client, Task } from "@/types/home/codev";
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
  | "ColumnAddModal"
  | "boardAddModal"
  | "homeTermsAndConditionModal"
  | "homeFAQSModal"
  | "homePrivacyPolicyModal"
  | "deleteWarningModal"
  | "dashboardCurrentProjectModal"
  | "marketingCodevHireCodevModal"
  | "surveyModal";

interface ModalStore {
  type: ModalType | null;
  data?: Task | Client[] | any;
  dataObject?: any;
  callback?: () => void;
  isOpen: boolean;
  onOpen: (
    type: ModalType,
    data?: Task | Client[] | any,
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
  onOpen: (type, data?: Task | Client[] | any, dataObject?, callback?) =>
    set({ isOpen: true, type, data, dataObject, callback }),
  onClose: () => set({ type: null, isOpen: false, callback: undefined }),
}));

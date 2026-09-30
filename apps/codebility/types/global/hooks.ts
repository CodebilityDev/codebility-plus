import type { Task, Client } from "@/types/global/codev";

export type ModalType =
  | "companyProfile"
  | "termsAndCondition"
  | "privacyPolicy"
  | "techStackModal"
  | "scheduleModal"
  | "contactUsModal"
  | "privacyPolicyModal"
  | "termsOfServiceModal"
  | "timeTrackerTicketModal"
  | "boardAddModal"
  | "homeTermsAndConditionModal"
  | "homeFAQSModal"
  | "homePrivacyPolicyModal"
  | "deleteWarningModal"
  | "dashboardCurrentProjectModal"
  | "marketingCodevHireCodevModal"
  | "surveyModal";

export interface ModalStore {
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

export interface TechStack {
  stack: string[];
  nonTech: boolean;
  addRemoveStack: (tech: string) => void;
  clearStack: () => void;
  setStack: (i: string[]) => void;
  setNonTech: () => void;
}

export type Listener = () => void;
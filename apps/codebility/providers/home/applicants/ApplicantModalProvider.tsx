"use client";

import { useState, createContext, useContext } from "react";
import ApplicantProfileModal from "@/components/home/applicants/ApplicantProfileModal";
import type { ApplicantModalContextValue, ApplicantModalProviderProps, NewApplicantType } from "@/types/home/applicants/applicants";

const ModalContext = createContext<ApplicantModalContextValue | null>(null);

export const useApplicantModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useApplicantModal must be used within ApplicantModalProvider');
  }
  return context;
};

export default function ApplicantModalProvider({
  children
}: ApplicantModalProviderProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<NewApplicantType | null>(null);

  const openModal = (applicant: NewApplicantType) => {
    setSelectedApplicant(applicant);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
  };

  const modalValue: ApplicantModalContextValue = {
    isModalOpen: selectedApplicant !== null,
    selectedApplicant,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={modalValue}>
      {children}
      {selectedApplicant ? <ApplicantProfileModal /> : null}
    </ModalContext.Provider>
  );
}

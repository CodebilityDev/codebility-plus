// apps/codebility/app/home/applicants/_components/ApplicantClientWrapper.tsx

"use client";

import { ReactNode, useState, createContext, useContext } from "react";
import ApplicantProfileModal from "./ApplicantProfileModal";
import { NewApplicantType } from "../_service/types";

interface ModalContextType {
  isModalOpen: boolean;
  selectedApplicant: NewApplicantType | null;
  openModal: (applicant: NewApplicantType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useApplicantModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useApplicantModal must be used within ApplicantClientWrapper');
  }
  return context;
};

interface ApplicantClientWrapperProps {
  children: ReactNode;
}

// Alternative approach - manage modal state directly instead of using useModal hook
export default function ApplicantClientWrapper({ 
  children 
}: ApplicantClientWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<NewApplicantType | null>(null);

  const openModal = (applicant: NewApplicantType) => {
    console.log("🚀 Opening modal for:", applicant.first_name, applicant.last_name);
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("🔒 Closing modal");
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const modalValue: ModalContextType = {
    isModalOpen,
    selectedApplicant,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={modalValue}>
      {children}
      <ApplicantProfileModal />
    </ModalContext.Provider>
  );
}
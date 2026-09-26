"use client";

import { useEffect, useState, ReactNode } from "react";
import DeleteWarningModal from "@/components/modals/DeleteWarningModal";
import PrivacyPolicyModal from "@/components/modals/PrivacyPolicyModal";
import TechStackModal from "@/components/modals/TechStackModal";
import TermsOfServiceModal from "@/components/modals/TermsOfServiceModal";

interface ModalProviderHomeProps {
  children?: ReactNode;
}

export const ModalProviderHome = ({ children }: ModalProviderHomeProps = {}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {children}
      <PrivacyPolicyModal />
      <TermsOfServiceModal />
      <DeleteWarningModal />
      <TechStackModal />
    </>
  );
};

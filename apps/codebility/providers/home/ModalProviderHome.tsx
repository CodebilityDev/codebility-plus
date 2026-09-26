"use client";

import { useEffect, useState, ReactNode } from "react";
import DeleteWarningModal from "@/components/home/DeleteWarningModal";
import PrivacyPolicyModal from "@/components/global/modals/PrivacyPolicyModal";
import TechStackModal from "@/components/global/modals/TechStackModal";
import TermsOfServiceModal from "@/components/home/TermsOfServiceModal";

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

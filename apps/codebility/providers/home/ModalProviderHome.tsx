"use client";

import DeleteWarningModal from "@/components/home/DeleteWarningModal";
import PrivacyPolicyModal from "@/components/global/modals/PrivacyPolicyModal";
import TechStackModal from "@/components/global/modals/TechStackModal";
import TermsOfServiceModal from "@/components/home/TermsOfServiceModal";
import type { ModalProviderHomeProps } from "@/types/home/home";

export const ModalProviderHome = ({ children }: ModalProviderHomeProps = {}) => (
  <>
    {children}
    <PrivacyPolicyModal />
    <TermsOfServiceModal />
    <DeleteWarningModal />
    <TechStackModal />
  </>
);

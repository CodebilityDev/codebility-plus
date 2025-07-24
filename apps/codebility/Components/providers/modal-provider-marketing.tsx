"use client";

import { useEffect, useState } from "react";
import FaqsModal from "@/app/(marketing)/_components/marketing_modals/MarketingFaqsModal";
import PrivacyPolicyModalHome from "@/app/(marketing)/_components/marketing_modals/MarketingPrivacyPolicyModal";
import TermsAndConditionModal from "@/app/(marketing)/_components/marketing_modals/MarketingTermsAndConditionModal";
import ContactUsModal from "@/components/modals/ContactUsModal";

import AvailableTimeModal from "../modals/AvailableTimeModal";
import TechStackModal from "../modals/TechStackModal";

export const ModalProviderMarketing = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <AvailableTimeModal />
      <TechStackModal />
      <TermsAndConditionModal />
      <PrivacyPolicyModalHome />
      <FaqsModal />
      <ContactUsModal />
    </>
  );
};

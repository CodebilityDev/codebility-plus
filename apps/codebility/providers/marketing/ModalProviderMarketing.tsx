"use client";

import { useEffect, useState } from "react";
import FaqsModal from "@/components/marketing/MarketingFaqsModal";
import PrivacyPolicyModalHome from "@/components/marketing/MarketingPrivacyPolicyModal";
import TermsAndConditionModal from "@/components/marketing/MarketingTermsAndConditionModal";
import ContactUsModal from "@/components/marketing/ContactUsModal";

import AvailableTimeModal from "@/components/marketing/AvailableTimeModal";
import TechStackModal from "@/components/global/modals/TechStackModal";

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

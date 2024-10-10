"use client";

import { useEffect, useState } from "react";
import FaqsModal from "@/app/(marketing)/_components/marketing_modals/marketing-faqs-modal";
import PrivacyPolicyModalHome from "@/app/(marketing)/_components/marketing_modals/marketing-privacy-policy-modal";
import TermsAndConditionModal from "@/app/(marketing)/_components/marketing_modals/marketing-terms-and-condition-modal";
import ContactUsModal from "@/Components/modals/ContactUsModal";

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
      <TermsAndConditionModal />
      <PrivacyPolicyModalHome />
      <FaqsModal />
      <ContactUsModal />
    </>
  );
};

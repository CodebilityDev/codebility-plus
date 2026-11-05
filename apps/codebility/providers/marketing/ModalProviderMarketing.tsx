import { ModalSlot } from "@/components/global/modals/ModalSlot";
import FaqsModal from "@/components/marketing/MarketingFaqsModal";
import PrivacyPolicyModalHome from "@/components/marketing/MarketingPrivacyPolicyModal";
import TermsAndConditionModal from "@/components/marketing/MarketingTermsAndConditionModal";
import ContactUsModal from "@/components/marketing/ContactUsModal";
import AvailableTimeModal from "@/components/marketing/AvailableTimeModal";
import TechStackModal from "@/components/global/modals/TechStackModal";

export const ModalProviderMarketing = () => {
  return (
    <>
      <ModalSlot type="scheduleModal">
        <AvailableTimeModal />
      </ModalSlot>
      <ModalSlot type="techStackModal">
        <TechStackModal />
      </ModalSlot>
      <ModalSlot type="homeTermsAndConditionModal">
        <TermsAndConditionModal />
      </ModalSlot>
      <ModalSlot type="homePrivacyPolicyModal">
        <PrivacyPolicyModalHome />
      </ModalSlot>
      <ModalSlot type="homeFAQSModal">
        <FaqsModal />
      </ModalSlot>
      <ModalSlot type="contactUsModal">
        <ContactUsModal />
      </ModalSlot>
    </>
  );
};
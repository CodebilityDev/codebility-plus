import { ModalSlot } from "@/components/global/modals/ModalSlot";
import DeleteWarningModal from "@/components/home/DeleteWarningModal";
import PrivacyPolicyModal from "@/components/global/modals/PrivacyPolicyModal";
import TechStackModal from "@/components/global/modals/TechStackModal";
import TermsOfServiceModal from "@/components/home/TermsOfServiceModal";
import type { ModalProviderHomeProps } from "@/types/home/home";

export const ModalProviderHome = ({ children }: ModalProviderHomeProps = {}) => (
  <>
    {children}
    <ModalSlot type="privacyPolicyModal">
      <PrivacyPolicyModal />
    </ModalSlot>
    <ModalSlot type="termsOfServiceModal">
      <TermsOfServiceModal />
    </ModalSlot>
    <ModalSlot type="deleteWarningModal">
      <DeleteWarningModal />
    </ModalSlot>
    <ModalSlot type="techStackModal">
      <TechStackModal />
    </ModalSlot>
  </>
);

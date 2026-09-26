"use client";



import { useModal } from "@/hooks/global/use-modal";

import { Dialog, DialogContent, DialogTitle } from "@codevs/ui";
import { PrivacyPolicyModalContent } from "@/components/marketing/PrivacyPolicyModalContent";
import { PrivacyPolicyModalFooter } from "@/components/marketing/PrivacyPolicyModalFooter";
import { PrivacyPolicyModalNavBar } from "@/components/marketing/PrivacyPolicyModalNavBar";


function PrivacyPolicyModal() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "homePrivacyPolicyModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      {/* CRITICAL FIX: Match Terms structure - bg-black-800 on DialogContent */}
      <DialogContent className="bg-black-800 flex max-h-full max-w-[1260px] flex-col justify-between text-white">
        <DialogTitle className="sr-only">Privacy Policy</DialogTitle>
        <div className="flex h-full overflow-hidden rounded-[10px] border border-[#1D1D1E]">
          <div className="hidden sm:flex">
            <PrivacyPolicyModalNavBar />
          </div>
          <PrivacyPolicyModalContent />
        </div>
        <PrivacyPolicyModalFooter onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default PrivacyPolicyModal;
"use client";



import { useModal } from "@/hooks/global/use-modal";

import { Dialog, DialogContent, DialogTitle } from "@codevs/ui/dialog";
import { TermsAndConditionContent } from "@/components/marketing/TermsAndConditionContent";
import { TermsAndConditionFooter } from "@/components/marketing/TermsAndConditionFooter";
import { TermsAndConditionNavBar } from "@/components/marketing/TermsAndConditionNavBar";


function TermsAndCondition() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "homeTermsAndConditionModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black-800 flex max-h-full max-w-[1260px] flex-col justify-between text-white">
        <DialogTitle className="sr-only">Terms and Conditions</DialogTitle>
        <div className="flex h-full overflow-hidden rounded-[10px] border border-[#1D1D1E]">
          <div className="hidden sm:flex">
            <TermsAndConditionNavBar />
          </div>
          <TermsAndConditionContent />
        </div>
        <TermsAndConditionFooter onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export default TermsAndCondition;

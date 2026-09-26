"use client";

import { Suspense } from "react";








import { Dialog, DialogContent } from "@/components/global/ui/dialog";



import { ServiceDetailSkeleton } from "@/components/marketing/services/ServiceDetailSkeleton";
import type { ServiceDetailModalProps } from "@/types/marketing/services/services";
import { ServiceDetailBody } from "@/components/marketing/services/ServiceDetailBody";



export const ServiceDetailModal = ({
  projectId,
  isOpen,
  onClose,
}: ServiceDetailModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="max-w-full w-[95vw] sm:w-[90vw] lg:w-[80vw] h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden"
      >
        {projectId ? (
          <Suspense fallback={<ServiceDetailSkeleton />}>
            <ServiceDetailBody projectId={projectId} />
          </Suspense>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

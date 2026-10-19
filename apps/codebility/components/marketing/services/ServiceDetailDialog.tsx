"use client";

import { useRouter } from "next/navigation";

import { Dialog, DialogContent } from "@/components/global/ui/dialog";
import { servicesHref } from "@/utils/global/services-categories";

export function ServiceDetailDialog({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.replace(servicesHref({ project: null }), { scroll: false });
        }
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="max-w-full w-[95vw] sm:w-[90vw] lg:w-[80vw] h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

import { Suspense } from "react";

import { ServiceDetailDialog } from "@/components/marketing/services/ServiceDetailDialog";
import { ServiceDetailSection } from "@/components/marketing/services/ServiceDetailSection";
import { ServiceDetailSkeleton } from "@/components/marketing/services/ServiceDetailSkeleton";
import type { ServicesDetailModalSlotProps } from "@/types/marketing/services/services";

export function ServicesDetailModalSlot({ projectId }: ServicesDetailModalSlotProps) {
  if (!projectId) return null;

  return (
    <ServiceDetailDialog>
      <Suspense fallback={<ServiceDetailSkeleton />}>
        <ServiceDetailSection projectId={projectId} />
      </Suspense>
    </ServiceDetailDialog>
  );
}

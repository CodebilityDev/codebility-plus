import { getCachedServicesProjectById } from "@/lib/global/services-projects-cached";

import { ServiceDetailBody } from "@/components/marketing/services/ServiceDetailBody";
import type { ServiceDetailSectionProps } from "@/types/marketing/services/services";

export async function ServiceDetailSection({ projectId }: ServiceDetailSectionProps) {
  const service = await getCachedServicesProjectById(projectId);

  if (!service) {
    return (
      <div className="px-4 py-12 text-center text-sm text-gray-500 sm:px-6">
        Project details unavailable.
      </div>
    );
  }

  return <ServiceDetailBody service={service} />;
}

"use client";

import Calendly from "@/components/global/marketing/MarketingCalendly";
import { ServiceDetailModal } from "@/components/marketing/services/ServiceDetailModal";
import { Hero as ServicesHero } from "@/components/marketing/services/ServicesHero";
import { ServicesTab } from "@/components/marketing/services/ServicesTab";
import type { ServicesPageContentProps } from "@/types/marketing/services/services";
import { parseServicesCategory, servicesHref } from "@/utils/global/services-categories";
import { useRouter, useSearchParams } from "next/navigation";

export function ServicesPageBody({ initialData, pageSize }: ServicesPageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = parseServicesCategory(searchParams.get("category"));
  const projectId = searchParams.get("project");

  const replaceServicesUrl = (next: {
    category?: typeof category;
    project?: string | null;
  }) => {
    router.replace(
      servicesHref({
        category: next.category ?? category,
        project: next.project === undefined ? projectId : next.project,
      }),
      { scroll: false },
    );
  };

  return (
    <>
      <ServicesHero />
      <ServicesTab
        key={category}
        initialData={initialData}
        category={category}
        pageSize={pageSize}
        onServiceSelect={(service) => {
          replaceServicesUrl({ project: service.id });
        }}
      />
      <Calendly />
      <ServiceDetailModal
        projectId={projectId}
        isOpen={!!projectId}
        onClose={() => {
          replaceServicesUrl({ project: null });
        }}
      />
    </>
  );
}

"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  parseServicesCategory,
  servicesHref,
} from "@/lib/services/services-categories";
import type { ServicesProjectsPage } from "@/lib/server/services-projects-cached";

import Calendly from "../../../_components/MarketingCalendly";
import { ServicesTab } from "../tabs";
import { Hero as ServicesHero } from "./ServicesHero";
import { ServiceDetailModal } from "./ServiceDetailModal";

interface Props {
  initialData: ServicesProjectsPage;
  pageSize: number;
}

function ServicesPageBody({ initialData, pageSize }: Props) {
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

export const ServicesPageContent = ({ initialData, pageSize }: Props) => {
  return (
    <Suspense
      fallback={
        <>
          <ServicesHero />
          <ServicesTab
            initialData={initialData}
            category="all"
            pageSize={pageSize}
          />
          <Calendly />
        </>
      }
    >
      <ServicesPageBody initialData={initialData} pageSize={pageSize} />
    </Suspense>
  );
};

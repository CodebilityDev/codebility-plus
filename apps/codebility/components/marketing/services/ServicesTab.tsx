"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { servicesHref } from "@/utils/global/services-categories";

import { ServicesGridSkeleton } from "@/components/marketing/services/ServicesGridSkeleton";
import { ServicesPaginationSlot } from "@/components/marketing/services/ServicesPaginationSlot";
import { ServicesProjectsGrid } from "@/components/marketing/services/ServicesProjectsGrid";
import { ServicesTabBar } from "@/components/marketing/services/ServicesTabBar";

import type { ServicesCategorySlug } from "@/types/global/constants";
import type { ServicesTabProps } from "@/types/marketing/services/services";

export const ServicesTab = ({ initialData, category }: ServicesTabProps) => {
  const router = useRouter();
  // The server still does the fetching. This only surfaces the in-flight state
  // of that navigation so the skeleton shows instead of the stale page.
  const [isPending, startTransition] = useTransition();

  const { pagination } = initialData;
  const page = pagination.page;
  const totalPages = Math.max(1, pagination.totalPages);

  const openService = (service: { id: string }) => {
    router.replace(servicesHref({ category, project: service.id }), {
      scroll: false,
    });
  };

  const selectCategory = (next: ServicesCategorySlug) => {
    startTransition(() => {
      router.replace(servicesHref({ category: next }), { scroll: false });
    });
  };

  return (
    <>
      <ServicesTabBar active={category} onSelect={selectCategory} />

      <div className="mx-auto max-w-screen-2xl w-full" id="services-grid">
        {isPending ? (
          <ServicesGridSkeleton />
        ) : (
          <ServicesProjectsGrid
            projects={initialData.projects}
            page={page}
            onServiceSelect={openService}
          />
        )}
      </div>

      <ServicesPaginationSlot
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => {
          startTransition(() => {
            router.replace(servicesHref({ category, page: nextPage }), {
              scroll: false,
            });
          });
        }}
      />
    </>
  );
};

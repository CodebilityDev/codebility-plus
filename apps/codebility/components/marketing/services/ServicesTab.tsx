"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import Container from "@/components/global/marketing/MarketingContainer";
import Section from "@/components/global/marketing/MarketingSection";

import { SERVICES_CATEGORY_TABS } from "@/constants/global/services-categories";
import type { ServicesCategorySlug } from "@/types/global/constants";
import { useMarketingPageUrl } from "@/hooks/global/use-marketing-page-url";
import { categoryHref } from "@/utils/global/services-categories";




import { ServicesGridSkeleton } from "@/components/marketing/services/ServicesGridSkeleton";
import { ServicesPaginationSlot } from "@/components/marketing/services/ServicesPaginationSlot";

import type { ServicesTabProps } from "@/types/marketing/services/services";
import { resolveSkeletonCount } from "@/utils/marketing/services/services";
import { ServicesTabGrid } from "@/components/marketing/services/ServicesTabGrid";
import { rememberPagination, resolvePagination } from "@/lib/marketing/services/services-tab-loader";


export const ServicesTab = ({
  initialData,
  category,
  pageSize,
  onServiceSelect,
}: ServicesTabProps) => {
  const [page, setPage] = useState(initialData.pagination.page);
  const [, startTransition] = useTransition();

  rememberPagination(
    initialData.category as ServicesCategorySlug,
    initialData.pagination.page,
    pageSize,
    initialData.pagination,
  );

  const activePagination = resolvePagination(
    category,
    page,
    pageSize,
    initialData,
  );
  const totalPages = Math.max(1, activePagination.totalPages);
  const skeletonCount = resolveSkeletonCount(
    page,
    pageSize,
    activePagination.total,
  );

  useMarketingPageUrl(page, (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  });

  const onPageChange = (nextPage: number) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <Section id="services-projects" className="relative !pt-0">
      <Container className="relative z-0 !max-w-full px-4 sm:px-8 xl:min-w-[1260px] 2xl:min-w-[1560px]">
        <div className="flex flex-col gap-4">
          <div
            id="services-categories"
            className="mx-auto flex max-w-full flex-wrap justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm sm:gap-2.5 dark:bg-white/5"
          >
            {SERVICES_CATEGORY_TABS.map((tab) => {
              const isActive = category === tab.slug;
              return (
                <Link
                  key={tab.slug}
                  href={categoryHref(tab.slug)}
                  scroll={false}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-base ${
                    isActive
                      ? "bg-white text-gray-900 shadow-lg"
                      : "text-white hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          <div id="services-grid">
            <Suspense
              key={`${category}:${page}`}
              fallback={<ServicesGridSkeleton count={skeletonCount} />}
            >
              <ServicesTabGrid
                category={category}
                page={page}
                pageSize={pageSize}
                initialData={initialData}
                onServiceSelect={onServiceSelect}
              />
            </Suspense>
          </div>

          <ServicesPaginationSlot
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </Container>
    </Section>
  );
};

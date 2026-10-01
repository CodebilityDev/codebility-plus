"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/global/marketing/MarketingContainer";
import Section from "@/components/global/marketing/MarketingSection";

import { SERVICES_CATEGORY_TABS } from "@/constants/global/services-categories";
import { servicesHref } from "@/utils/global/services-categories";

import { ServicesGridSkeleton } from "@/components/marketing/services/ServicesGridSkeleton";
import { ServicesPaginationSlot } from "@/components/marketing/services/ServicesPaginationSlot";
import { ServicesProjectsGrid } from "@/components/marketing/services/ServicesProjectsGrid";

import type { ServicesTabProps } from "@/types/marketing/services/services";

export const ServicesTab = ({
  initialData,
  category,
}: ServicesTabProps) => {
  const router = useRouter();
  // The server still does the fetching. This only surfaces the in-flight state
  // of that navigation so the skeleton shows instead of the stale page.
  const [isPending, startTransition] = useTransition();

  const { pagination } = initialData;
  const page = pagination.page;
  const totalPages = Math.max(1, pagination.totalPages);
  
  const openService = (service: { id: string }) => {
    router.replace(
      servicesHref({ category, project: service.id }),
      { scroll: false },
    );
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
              const href = servicesHref({ category: tab.slug });
              return (
                <Link
                  key={tab.slug}
                  href={href}
                  scroll={false}
                  onClick={(event) => {
                    // Keep the Link for its href and prefetch, but route the
                    // navigation through a transition so the grid shows its
                    // skeleton while the new category is fetched.
                    event.preventDefault();
                    startTransition(() => {
                      router.replace(href, { scroll: false });
                    });
                  }}
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
                router.replace(
                  servicesHref({ category, page: nextPage }),
                  { scroll: false },
                );
              });
            }}
          />
        </div>
      </Container>
    </Section>
  );
};
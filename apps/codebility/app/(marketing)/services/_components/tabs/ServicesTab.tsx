"use client";

import { Suspense, use, useState, useTransition } from "react";
import Link from "next/link";
import Container from "@/app/(marketing)/_components/MarketingContainer";
import Section from "@/app/(marketing)/_components/MarketingSection";
import DefaultPagination from "@/components/ui/pagination";
import {
  SERVICES_CATEGORY_TABS,
  type ServicesCategorySlug,
} from "@/constants/services/categories";
import { useMarketingPageUrl } from "@/hooks/marketing/use-marketing-page-url";
import { categoryHref } from "@/utils/services/categories";
import type { ServicesProjectsPage } from "@/lib/server/services-projects-cached";
import { fetchApiJson } from "@/utils/api-fetch";

import type { ServiceProject } from "../ui/ServicesServiceCard";
import { ServicesGridSkeleton, ServicesServiceCard, servicesProjectsGridClass } from "../ui";

const pagePromises = new Map<string, Promise<ServicesProjectsPage>>();
const pageMetaCache = new Map<string, ServicesProjectsPage["pagination"]>();

function pageCacheKey(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
) {
  return `${category}:${page}:${pageSize}`;
}

function filterCacheKey(category: ServicesCategorySlug, pageSize: number) {
  return `${category}:${pageSize}`;
}

function rememberPagination(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
  pagination: ServicesProjectsPage["pagination"],
) {
  pageMetaCache.set(pageCacheKey(category, page, pageSize), pagination);
  pageMetaCache.set(filterCacheKey(category, pageSize), pagination);
}

function resolvePagination(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
  initialData: ServicesProjectsPage,
): ServicesProjectsPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(category, page, pageSize)) ??
    pageMetaCache.get(filterCacheKey(category, pageSize)) ??
    (category === initialData.category
      ? initialData.pagination
      : { page, limit: pageSize, total: 0, totalPages: 0 })
  );
}

function loadPage(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
  initialData: ServicesProjectsPage,
): Promise<ServicesProjectsPage> {
  const key = pageCacheKey(category, page, pageSize);
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (
    page === initialData.pagination.page &&
    category === initialData.category
  ) {
    rememberPagination(category, page, pageSize, initialData.pagination);
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const promise = fetchApiJson<ServicesProjectsPage>(
    `/api/services-projects?category=${category}&page=${page}&limit=${pageSize}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching services projects page:", result.error);
      const fallback = {
        projects: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        },
        category,
      };
      rememberPagination(category, page, pageSize, fallback.pagination);
      return fallback;
    }

    rememberPagination(category, page, pageSize, result.data.pagination);
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

function resolveSkeletonCount(
  page: number,
  pageSize: number,
  total: number,
) {
  if (total <= 0) {
    return pageSize;
  }

  const remaining = total - (page - 1) * pageSize;
  return Math.min(pageSize, Math.max(1, remaining));
}

function ServicesProjectsGrid({
  projects,
  page,
  onServiceSelect,
}: {
  projects: ServiceProject[];
  page: number;
  onServiceSelect?: (service: ServiceProject) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center text-white">
        No projects available for this category
      </div>
    );
  }

  return (
    <div key={page} className={servicesProjectsGridClass}>
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="animate-fade-in-up aspect-square w-full"
          style={{
            animationDelay: `${index * 80}ms`,
            animationFillMode: "both",
          }}
        >
          <ServicesServiceCard service={project} onSelect={onServiceSelect} />
        </div>
      ))}
    </div>
  );
}

function ServicesTabRemote({
  category,
  page,
  pageSize,
  initialData,
  onServiceSelect,
}: {
  category: ServicesCategorySlug;
  page: number;
  pageSize: number;
  initialData: ServicesProjectsPage;
  onServiceSelect?: (service: ServiceProject) => void;
}) {
  const data = use(loadPage(category, page, pageSize, initialData));

  return (
    <ServicesProjectsGrid
      projects={data.projects}
      page={page}
      onServiceSelect={onServiceSelect}
    />
  );
}

function ServicesTabGrid({
  category,
  page,
  pageSize,
  initialData,
  onServiceSelect,
}: {
  category: ServicesCategorySlug;
  page: number;
  pageSize: number;
  initialData: ServicesProjectsPage;
  onServiceSelect?: (service: ServiceProject) => void;
}) {
  if (
    page === initialData.pagination.page &&
    category === initialData.category
  ) {
    return (
      <ServicesProjectsGrid
        projects={initialData.projects}
        page={page}
        onServiceSelect={onServiceSelect}
      />
    );
  }

  return (
    <ServicesTabRemote
      category={category}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
      onServiceSelect={onServiceSelect}
    />
  );
}

function ServicesPaginationSlot({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return <div className="mt-6 min-h-[4.5rem]" aria-hidden="true" />;
  }

  const currentPage = Math.min(page, totalPages);

  return (
    <div id="services-pagination" className="mt-6 min-h-[4.5rem] text-white">
      <DefaultPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => {
          onPageChange(Math.min(totalPages, currentPage + 1));
        }}
        handlePreviousPage={() => {
          onPageChange(Math.max(1, currentPage - 1));
        }}
        setCurrentPage={onPageChange}
      />
    </div>
  );
}

interface Props {
  initialData: ServicesProjectsPage;
  category: ServicesCategorySlug;
  pageSize: number;
  onServiceSelect?: (service: ServiceProject) => void;
}

export const ServicesTab = ({
  initialData,
  category,
  pageSize,
  onServiceSelect,
}: Props) => {
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

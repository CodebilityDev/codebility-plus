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
import { categoryHref } from "@/utils/services/categories";
import type { ServicesProjectsPage } from "@/lib/server/services-projects-cached";
import { fetchApiJson } from "@/utils/api-fetch";

import type { ServiceProject } from "../ui/ServicesServiceCard";
import { ServicesServiceCard } from "../ui";

const pagePromises = new Map<string, Promise<ServicesProjectsPage>>();

function loadPage(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
  initialData: ServicesProjectsPage,
): Promise<ServicesProjectsPage> {
  const key = `${category}:${page}:${pageSize}`;
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (
    page === initialData.pagination.page &&
    category === initialData.category
  ) {
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
      return {
        projects: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        },
        category,
      };
    }
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

function ServicesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square w-full animate-pulse rounded-xl bg-white/5"
        />
      ))}
    </div>
  );
}

function ServicesProjectsGrid({
  projects,
  onServiceSelect,
}: {
  projects: ServiceProject[];
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
  onPageChange,
  isPending,
}: {
  category: ServicesCategorySlug;
  page: number;
  pageSize: number;
  initialData: ServicesProjectsPage;
  onServiceSelect?: (service: ServiceProject) => void;
  onPageChange: (page: number) => void;
  isPending: boolean;
}) {
  const data = use(loadPage(category, page, pageSize, initialData));
  const totalPages = Math.max(1, data.pagination.totalPages);
  const currentPage = Math.min(page, totalPages);

  return (
    <>
      <div
        id="services-grid"
        className={`transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <ServicesProjectsGrid
          projects={data.projects}
          onServiceSelect={onServiceSelect}
        />
      </div>

      {totalPages > 1 && (
        <div id="services-pagination" className="text-white">
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
      )}
    </>
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
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

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

          <Suspense fallback={<ServicesGridSkeleton />}>
            <ServicesTabRemote
              category={category}
              page={page}
              pageSize={pageSize}
              initialData={initialData}
              onServiceSelect={onServiceSelect}
              onPageChange={onPageChange}
              isPending={isPending}
            />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
};

"use client";

import React, { useCallback, useState } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { CATEGORIES, pageSize } from "@/constants";
import { useModal } from "@/hooks/modals/use-modal-projects";
import { usePaginatedQuery } from "@/hooks/query/use-paginated-query";
import { qk } from "@/lib/shared/query-keys";
import type { Page } from "@/lib/server/paginate";
import { Project } from "@/types/home/codev";

import Container from "../../../(marketing)/_components/MarketingContainer";
import Section from "../../../(marketing)/_components/MarketingSection";
import ProjectCard from "./ProjectCard";
import { getProjectsPageAction } from "@/actions/projects/actions";

interface ProjectCardContainerProps {
  initialData: Page<Project>;
}

// Define a special ID for the "All" category
const ALL_CATEGORY_ID = 0;

const ProjectCardContainer = ({ initialData }: ProjectCardContainerProps) => {
  // Initialize with "All" category
  const [currentCategory, setCurrentCategory] =
    useState<number>(ALL_CATEGORY_ID);

  // Track current page for each tab - initialize with empty object
  const [page, setPage] = useState(1);

  const { onOpen } = useModal();

  const queryKey = qk.projects.list({ category: currentCategory, page });

  const { data, isPending } = usePaginatedQuery<Project>(
    queryKey,
    () =>
      getProjectsPageAction({
        page,
        pageSize: pageSize.projects,
        categoryId: currentCategory === ALL_CATEGORY_ID ? undefined : currentCategory,
      }),
    {
      initialData,
      // page.tsx renders exactly this key: all categories, page 1.
      initialDataKey: qk.projects.list({ category: ALL_CATEGORY_ID, page: 1 }),
    },
  );

  const totalPages = Math.max(Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 1)), 1);

  const handleTabClick = useCallback((categoryId: number) => {
    setCurrentCategory(categoryId);
    setPage(1);
  }, []);

  const rows = data?.rows ?? [];

  return (
    <Section>
      <Container className="relative z-0">
        <div className="flex flex-col gap-10">
          {/* Category Tabs - Added "All" category */}
          <div className="mx-auto flex flex-wrap justify-center gap-2 p-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => handleTabClick(ALL_CATEGORY_ID)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentCategory === ALL_CATEGORY_ID
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
              key={category.id}
              onClick={() => handleTabClick(category.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                currentCategory === category.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                : "text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              >
              {category.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isPending ? (
              Array.from({ length: pageSize.projects }).map((_, i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                />
              ))
            ) : rows.length > 0 ? (
              rows.map((project) => {
                if (!project || !project.id) return null;
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpen={onOpen}
                    categoryId={
                      currentCategory === ALL_CATEGORY_ID
                        ? project.categories?.[0]?.id
                        : currentCategory
                    }
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-700 dark:text-gray-300">
                No projects available for this category
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <DefaultPagination
              currentPage={Math.max(1, Math.min(page, totalPages))}
              handleNextPage={() => setPage((p) => Math.min(p + 1, totalPages))}
              handlePreviousPage={() => setPage((p) => Math.max(p - 1, 1))}
              setCurrentPage={(target: number) =>
                setPage(Math.max(1, Math.min(target, totalPages)))
              }
              totalPages={totalPages}
            />
          )}
        </div>
      </Container>
    </Section>
  );
};

export default ProjectCardContainer;

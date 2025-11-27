"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Container from "@/app/(marketing)/_components/MarketingContainer";
import Section from "@/app/(marketing)/_components/MarketingSection";
import DefaultPagination from "@/components/ui/pagination";
import { CATEGORIES, pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";

import type { ServiceProject } from "../ui/ServicesServiceCard";
import { ServicesServiceCard } from "../ui";

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  github_link?: string;
  main_image?: string;
  website_url?: string;
  figma_link?: string;
  team_leader?: TeamMember;
  client_id?: string;
  members?: TeamMember[];
  categories?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  created_at?: string;
  updated_at?: string;
  tech_stack?: string[];
}

interface Props {
  servicesData: ProjectData[];
  onServiceSelect?: (service: ServiceProject) => void;
}

const ALL_CATEGORY_ID = 0;

export const ServicesTab = memo(({ servicesData, onServiceSelect }: Props) => {
  const [currentCategory, setCurrentCategory] =
    useState<number>(ALL_CATEGORY_ID);
  const [tabPages, setTabPages] = useState(() => {
    const pages: Record<number, number> = {
      [ALL_CATEGORY_ID]: 1,
    };
    CATEGORIES.forEach((cat) => {
      pages[cat.id] = 1;
    });
    return pages;
  });

  const projects = useMemo(() => {
    return currentCategory === ALL_CATEGORY_ID
      ? servicesData
      : servicesData.filter((project) =>
          project.categories?.some((cat) => cat.id === currentCategory),
        );
  }, [currentCategory, servicesData]);

  const {
    paginatedData: paginatedProjects,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(projects, pageSize.services);

  useEffect(() => {
    setCurrentPage(tabPages[currentCategory] || 1);
  }, [currentCategory, setCurrentPage, tabPages]);

  const handleTabClick = (categoryId: number) => {
    setTabPages((prev) => ({
      ...prev,
      [currentCategory]: currentPage,
    }));
    setCurrentCategory(categoryId);
  };

  return (
    <Section className="relative">
      <Container className="relative z-0">
        <div className="flex flex-col gap-4">
          {/* Tabs */}
          <div className="mx-auto flex flex-wrap justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-1 backdrop-blur-sm dark:bg-white/5">
            <button
              onClick={() => handleTabClick(ALL_CATEGORY_ID)}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                currentCategory === ALL_CATEGORY_ID
                  ? "bg-white text-gray-900 shadow-lg"
                  : "text-white hover:bg-white/20 hover:text-white"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                  currentCategory === cat.id
                    ? "bg-white text-gray-900 shadow-lg"
                    : "text-white hover:bg-white/20 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="mx-[-4px] grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects && paginatedProjects.length > 0 ? (
              paginatedProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-fade-in-up px-1"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <ServicesServiceCard
                    service={project}
                    onSelect={onServiceSelect}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-white">
                No projects available for this category
              </div>
            )}
          </div>

          {/* Pagination */}
          {projects.length > pageSize.services && (
            <div className="text-white">
              <DefaultPagination
                currentPage={currentPage}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
});

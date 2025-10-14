"use client";

import { useEffect, useState, useMemo, memo } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { CATEGORIES, pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";

import Container from "../../_components/MarketingContainer";
import Section from "../../_components/MarketingSection";
import ServiceCard from "./ServicesServiceCard";

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
  project_category_id?: number;
  project_category_name?: string;
  created_at?: string;
  updated_at?: string;
  tech_stack?: string[];
}

interface Props {
  servicesData: ProjectData[];
}

// Define a special ID for the "All" category
const ALL_CATEGORY_ID = 0;

function ServicesTab({ servicesData }: Props) {
  // Initialize with "All" category
  const [currentCategory, setCurrentCategory] =
    useState<number>(ALL_CATEGORY_ID);

  const [tabPages, setTabPages] = useState(() => {
    const pages: Record<number, number> = {
      [ALL_CATEGORY_ID]: 1, // Add "All" category to tracked pages
    };
    CATEGORIES.forEach((cat) => {
      pages[cat.id] = 1;
    });
    return pages;
  });

  // Memoize filtered projects to prevent unnecessary recalculations
  const projects = useMemo(() => {
    return currentCategory === ALL_CATEGORY_ID
      ? servicesData
      : servicesData.filter(
          (project) => project.project_category_id === currentCategory,
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

  // Update current page when category changes
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
          {/* Category Tabs with "All" option */}
          <div className="mx-auto flex flex-wrap justify-center gap-2 p-1 bg-white/10 dark:bg-white/5 rounded-2xl backdrop-blur-sm border border-white/20">
            <button
              onClick={() => handleTabClick(ALL_CATEGORY_ID)}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
                className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mx-[-4px]">
            {paginatedProjects && paginatedProjects.length > 0 ? (
              paginatedProjects.map((project, index) => (
                <div 
                  key={project.id} 
                  className="animate-fade-in-up px-1"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <ServiceCard service={project} />
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
}

export default memo(ServicesTab);

"use client";

import { useEffect, useState } from "react";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize, CATEGORIES } from "@/constants";
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
}

interface Props {
  servicesData: ProjectData[];
}

export default function ServicesTab({ servicesData }: Props) {
  // Initialize with first category
  const [currentCategory, setCurrentCategory] = useState<number>(
    CATEGORIES[0].id,
  );

  const [projects, setProjects] = useState(() => {
    return servicesData.filter(
      (project) => project.project_category_id === CATEGORIES[0].id,
    );
  });

  const [tabPages, setTabPages] = useState(() => {
    const pages: Record<number, number> = {};
    CATEGORIES.forEach((cat) => {
      pages[cat.id] = 1;
    });
    return pages;
  });

  const {
    paginatedData: paginatedProjects,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(projects, pageSize.services);

  // Update projects when category changes
  useEffect(() => {
    const filteredData = servicesData.filter(
      (project) => project.project_category_id === currentCategory,
    );
    setProjects(filteredData);
    setCurrentPage(tabPages[currentCategory] || 1);
  }, [currentCategory, servicesData]);

  const handleTabClick = (categoryId: number) => {
    setTabPages((prev) => ({
      ...prev,
      [currentCategory]: currentPage,
    }));
    setCurrentCategory(categoryId);
  };  

  return (
    <Section className="relative">
      <Container className="relative z-10">
        <div className="flex flex-col gap-10">
          {/* Category Tabs */}
          <div className="mx-auto flex flex-wrap justify-center gap-5 xl:gap-16">
            {CATEGORIES.map((cat) => (
              <p
                key={cat.id}
                onClick={() => handleTabClick(cat.id)}
                className={`cursor-pointer px-2 pb-2 text-violet-200 xl:text-xl ${
                  currentCategory === cat.id
                    ? "border-violet text-violet border-b-2"
                    : "text-white"
                }`}
              >
                {cat.name}
              </p>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {paginatedProjects && paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <ServiceCard key={project.id} service={project} />
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

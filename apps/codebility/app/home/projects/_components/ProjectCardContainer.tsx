"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { CATEGORIES, pageSize } from "@/constants";
import { useModal } from "@/hooks/use-modal-projects";
import usePagination from "@/hooks/use-pagination";
import { Project } from "@/types/home/codev";

import Container from "../../../(marketing)/_components/MarketingContainer";
import Section from "../../../(marketing)/_components/MarketingSection";
import ProjectCard from "./ProjectCard";

interface ProjectCardContainerProps {
  projects: Project[];
}

// Define a special ID for the "All" category
const ALL_CATEGORY_ID = 0;

const ProjectCardContainer = ({ projects }: ProjectCardContainerProps) => {
  // Initialize with "All" category
  const [currentCategory, setCurrentCategory] =
    useState<number>(ALL_CATEGORY_ID);

  // Filter projects by current category
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Track current page for each tab
  const [tabPages, setTabPages] = useState(() => {
    const pages: Record<number, number> = {
      [ALL_CATEGORY_ID]: 1, // Add "All" category to tracked pages
    };
    CATEGORIES.forEach((cat) => {
      pages[cat.id] = 1;
    });
    return pages;
  });

  const { onOpen } = useModal();

  // Memoize filtered projects to prevent unnecessary recalculation
  const filteredProjectsMemo = useMemo(() => {
    // If "All" category is selected, show all projects
    // Otherwise, filter by the selected category
    return currentCategory === ALL_CATEGORY_ID
      ? projects
      : projects.filter(
          (project) => project.project_category_id === currentCategory,
        );
  }, [currentCategory, projects]);

  // First filter by category, then apply pagination
  useEffect(() => {
    setFilteredProjects(filteredProjectsMemo);
  }, [filteredProjectsMemo]);

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedProjects,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(filteredProjects, pageSize.projects);

  // Update current page when switching tabs
  useEffect(() => {
    setCurrentPage(tabPages[currentCategory] || 1);
  }, [currentCategory, tabPages]);

  const handleTabClick = useCallback((categoryId: number) => {
    // Save current page for the current tab before switching
    setTabPages((prev) => ({
      ...prev,
      [currentCategory]: currentPage,
    }));
    setCurrentCategory(categoryId);
  }, [currentCategory, currentPage]);

  return (
    <Section>
      <Container className="relative z-0">
        <div className="flex flex-col gap-10">
          {/* Category Tabs - Added "All" category */}
          <div className="mx-auto flex flex-wrap justify-center gap-5 xl:gap-16 ">
            <p
              onClick={() => handleTabClick(ALL_CATEGORY_ID)}
              className={`cursor-pointer px-2 pb-2 text-violet-200 xl:text-xl ${
                currentCategory === ALL_CATEGORY_ID
                  ? "border-violet text-violet border-b-2"
                  : "text-white"
              }`}
            >
              All
            </p>
            {CATEGORIES.map((category) => (
              <p
                key={category.id}
                onClick={() => handleTabClick(category.id)}
                className={`cursor-pointer px-2 pb-2 text-violet-200 xl:text-xl ${
                  currentCategory === category.id
                    ? "border-violet text-violet border-b-2"
                    : "text-white"
                }`}
              >
                {category.name}
              </p>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {paginatedProjects && paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={onOpen}
                  categoryId={
                    currentCategory === ALL_CATEGORY_ID
                      ? project.project_category_id
                      : currentCategory
                  }
                />
              ))
            ) : (
              <div className="col-span-full text-center text-white">
                No projects available for this category
              </div>
            )}
          </div>

          {filteredProjects.length > pageSize.projects && (
            <DefaultPagination
              currentPage={currentPage}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </Container>
    </Section>
  );
};

export default ProjectCardContainer;

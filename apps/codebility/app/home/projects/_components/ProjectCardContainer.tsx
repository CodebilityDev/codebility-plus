"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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

  // Track current page for each tab - initialize with empty object
  const [tabPages, setTabPages] = useState<Record<number, number>>({});

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
    const savedPage = tabPages[currentCategory] || 1;
    // Ensure the saved page doesn't exceed total pages
    const validPage = Math.min(savedPage, totalPages || 1);
    setCurrentPage(validPage);
  }, [currentCategory, tabPages, setCurrentPage, totalPages]);

  const handleTabClick = useCallback(
    (categoryId: number) => {
      // Save current page for the current tab before switching
      if (currentPage > 0 && currentPage <= totalPages) {
        setTabPages((prev) => ({
          ...prev,
          [currentCategory]: currentPage,
        }));
      }
      setCurrentCategory(categoryId);
    },
    [currentCategory, currentPage, totalPages],
  );

  return (
    <Section>
      <Container className="relative z-0">
        <div className="flex flex-col gap-10">
          {/* Category Tabs - Added "All" category */}
          <div className="mx-auto flex flex-wrap justify-center gap-5 xl:gap-16 ">
            <p
              onClick={() => handleTabClick(ALL_CATEGORY_ID)}
              className={`cursor-pointer border-b-2 px-2 pb-2 transition-colors xl:text-xl ${
              currentCategory === ALL_CATEGORY_ID
                ? "border-customBlue-300 text-customBlue-300 dark:border-customBlue-200 dark:text-customBlue-200"
                : "hover:text-customBlue-300 dark:hover:text-customBlue-200 border-transparent text-gray-700 dark:text-gray-300"
              }`}
            >
              All
            </p>
            {CATEGORIES.map((category) => (
              <p
              key={category.id}
              onClick={() => handleTabClick(category.id)}
              className={`cursor-pointer border-b-2 px-2 pb-2 transition-colors xl:text-xl ${
                currentCategory === category.id
                ? "border-customBlue-300 text-customBlue-300 dark:border-customBlue-200 dark:text-customBlue-200"
                : "hover:text-customBlue-300 dark:hover:text-customBlue-200 border-transparent text-gray-700 dark:text-gray-300"
              }`}
              >
              {category.name}
              </p>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {Array.isArray(paginatedProjects) &&
            paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => {
                if (!project || !project.id) return null;
                return (
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
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-700 dark:text-gray-300">
                No projects available for this category
              </div>
            )}
          </div>

          {filteredProjects.length > pageSize.projects && totalPages > 1 && (
            <DefaultPagination
              currentPage={Math.max(1, Math.min(currentPage, totalPages))}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              setCurrentPage={(page: number) => {
                const validPage = Math.max(1, Math.min(page, totalPages));
                setCurrentPage(validPage);
              }}
              totalPages={totalPages}
            />
          )}
        </div>
      </Container>
    </Section>
  );
};

export default ProjectCardContainer;

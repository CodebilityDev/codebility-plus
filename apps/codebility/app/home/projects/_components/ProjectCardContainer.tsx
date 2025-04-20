"use client";

import React, { useEffect, useState } from "react";
import ServiceCard from "@/app/(marketing)/services/_components/ServicesServiceCard";
import DefaultPagination from "@/Components/ui/pagination";
import { CATEGORIES, pageSize } from "@/constants";
import { useModal } from "@/hooks/use-modal-projects";
import usePagination from "@/hooks/use-pagination";
import { Project } from "@/types/home/codev";

import Container from "../../../(marketing)/_components/MarketingContainer";
import Section from "../../../(marketing)/_components/MarketingSection";
import ProjectCard from "./ProjectCard";
import { log } from "console";

interface ProjectCardContainerProps {
  projects: Project[];
}

const ProjectCardContainer = ({ projects }: ProjectCardContainerProps) => {
  // Initialize with first category
  const [currentCategory, setCurrentCategory] = useState<number>(
    CATEGORIES[0].id,
  );

  const [projectCard, setProjectCard] = useState(() => {
    return projects.filter(
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

  const { onOpen } = useModal();
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedProjects,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(projects, pageSize.projects);

  // Update projects when category changes
  useEffect(() => {
    const filteredData = projects.filter(
      (project) => project.project_category_id === currentCategory,
    );
    setProjectCard(filteredData);
    setCurrentPage(tabPages[currentCategory] || 1);
  }, [currentCategory, projects]);

  const handleTabClick = (categoryId: number) => {
    setTabPages((prev) => ({
      ...prev,
      [currentCategory]: currentPage,
    }));
    setCurrentCategory(categoryId);
  };

  return (
    <Section>
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
                <ProjectCard key={project.id} project={project} onOpen={onOpen} categoryId={currentCategory}/>
              ))
            ) : (
              <div className="col-span-full text-center text-white">
                No projects available for this category
              </div>
            )}
          </div>

          {projectCard.length > pageSize.projects && (
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

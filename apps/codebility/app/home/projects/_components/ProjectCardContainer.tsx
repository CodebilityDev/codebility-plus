"use client";

import React from "react";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import { useModal } from "@/hooks/use-modal-projects";
import usePagination from "@/hooks/use-pagination";
import { Project } from "@/types/home/codev";

import ProjectCard from "./ProjectCard";

interface ProjectCardContainerProps {
  projects: Project[];
}

const ProjectCardContainer = ({ projects }: ProjectCardContainerProps) => {
  const { onOpen } = useModal();
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedProjects,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(projects, pageSize.projects);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {paginatedProjects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} onOpen={onOpen} />
        ))}
      </div>

      {projects.length > pageSize.projects && (
        <DefaultPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </>
  );
};

export default ProjectCardContainer;

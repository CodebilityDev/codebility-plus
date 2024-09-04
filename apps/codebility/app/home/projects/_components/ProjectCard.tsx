"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"

import { pageSize } from "@/constants"
import { Button } from "@/Components/ui/button"
import usePagination from "@/hooks/use-pagination"
import { ProjectT } from "@/types/index"
import { useModal } from "@/hooks/use-modal-projects"
import DefaultPagination from "@/Components/ui/pagination"
import { IconLink, IconGithub } from "@/public/assets/svgs"
import { defaultAvatar } from "@/public/assets/images"

// import { ProjectT } from "../_types/projects-projectT"

const ProjectCard = ({ projects }: { projects: ProjectT[] }) => {
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {paginatedProjects.map((project: ProjectT) => (
          <div
            key={project.id}
            className="background-box flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-700"
          >
            <div className="bg-dark-100 flex justify-center rounded-t-lg">
              <Image
                alt={project as string}
                src={project.thumbnail || defaultAvatar}
                width={120}
                height={91}
                className="h-[120px] w-[91px] object-contain"
                loading="eager"
                priority
              />
            </div>
            <div className="text-dark100_light900 flex flex-col gap-4 p-8">
              <div className="flex w-full items-center justify-between gap-2">
                <p className="text-2xl">{project.name}</p>
                <p className="text-md">{project.status}</p>
              </div>
              <p className="md:text-md text-gray text-sm lg:text-lg">
                {project.summary}
              </p>
              <div className="flex items-center space-x-3">
                <Link href={project.github_link as string} target="_blank">
                  <IconGithub className="h-8 w-8 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                </Link>
                {project.live_link && (
                  <Link href={project.live_link} target="_blank">
                    <IconLink className="size-5 invert duration-300 hover:-translate-y-1  dark:invert-0" />
                  </Link>
                )}
              </div>
              <Button
                className="flex justify-end"
                onClick={() => onOpen("projectViewModal", project)}
                variant="link"
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
      {projects && projects.length > pageSize.projects && (
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

export default ProjectCard;

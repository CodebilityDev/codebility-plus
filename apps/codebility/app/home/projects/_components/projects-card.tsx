"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import { useModal } from "@/hooks/use-modal-projects";
import usePagination from "@/hooks/use-pagination";
import { defaultAvatar } from "@/public/assets/images";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import { ProjectT } from "@/types/index";

const ProjectsCard = ({ projects }: { projects: ProjectT[] }) => {
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
        {paginatedProjects.map((project: ProjectT) => (
          <div
            key={project.id}
            className="background-box flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-700"
          >
            <div className="dark:bg-dark-100 flex justify-center rounded-t-lg bg-slate-300">
              <Image
                alt={project.thumbnail as string}
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
                <p className="text-xl w-[70%] whitespace-normal break-words line-clamp-2">{project.name}</p>
                <p
                  className={`rounded-full border px-2 py-1 text-xs ${project.status?.toLowerCase() === "pending" ? "border-orange-500 text-orange-500" : project.status?.toLowerCase() === "on-going" ? "border-yellow-500 text-yellow-500" : project.status?.toLowerCase() === "completed" ? "text-green border-green" : "text-white"}`}
                >
                  {project.status}
                </p>
              </div>
              <p className="md:text-md text-gray line-clamp-1 h-7 text-sm lg:text-lg">
                {project?.summary}
              </p>
              <div className="flex h-7 items-center space-x-3">
                {project.github_link && (
                  <Link href={project.github_link as string} target="_blank">
                    <IconGithub className="size-5 invert duration-300 hover:-translate-y-1 dark:invert-0" />
                  </Link>
                )}
                {project.live_link && (
                  <Link href={project.live_link} target="_blank">
                    <IconLink className="size-5 invert duration-300 hover:-translate-y-1  dark:invert-0" />
                  </Link>
                )}
                {project.figma_link && (
                  <Link href={project.figma_link} target="_blank">
                    <IconFigma className="size-5 invert duration-300 hover:-translate-y-1  dark:invert-0" />
                  </Link>
                )}
              </div>
              <div className="mt-5 flex flex-col items-center justify-end gap-5 md:flex-row">
                <Button onClick={() => onOpen("projectViewModal", project)}>
                  View
                </Button>
                <Button
                  variant="purple"
                  onClick={() => onOpen("projectEditModal", project)}
                >
                  Edit
                </Button>
              </div>
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

export default ProjectsCard;

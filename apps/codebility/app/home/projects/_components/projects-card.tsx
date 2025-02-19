"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getMembers, getTeamLead } from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import { ModalType, useModal } from "@/hooks/use-modal-projects";
import usePagination from "@/hooks/use-pagination";
import { defaultAvatar } from "@/public/assets/images";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import { Codev, Project } from "@/types/home/codev";

// Import the ModalType

interface ProjectCardProps {
  project: Project;
  onOpen: (type: ModalType, data: Project) => void;
}

const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
  const [teamLead, setTeamLead] = useState<Codev | null>(null);
  const [members, setMembers] = useState<Codev[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (project.team_leader_id) {
        const { data } = await getTeamLead(project.team_leader_id);
        if (data) setTeamLead(data);
      }

      if (project.members && project.members.length > 0) {
        const { data } = await getMembers(project.members);
        if (data) setMembers(data);
      }
      setIsLoading(false);
    };

    fetchTeamData();
  }, [project]);

  return (
    <div
      onClick={() => onOpen("projectViewModal", project)}
      className={`background-box  flex
        cursor-pointer flex-col overflow-hidden rounded-xl 
        border border-zinc-200 transition-all
        hover:shadow-lg dark:border-zinc-700 dark:shadow-slate-700
        `}
    >
      {/* Project Image */}
      <div className="relative h-48 w-full">
        <Image
          alt={`${project.name} image`}
          src={project.main_image || defaultAvatar}
          fill
          className="object-cover"
          loading="eager"
          priority
        />
        <div
          className={`absolute right-2 top-2 flex items-center rounded-xl bg-slate-200 px-2
               py-1 text-slate-800 transition-all 
               dark:bg-zinc-700 dark:text-white
          `}
        >
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium 
            ${
              project.status === "active"
                ? "bg-green-500/20 text-green-500"
                : project.status === "pending"
                  ? "bg-orange-500/20 text-orange-500"
                  : project.status === "completed"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-gray-500/20 text-gray-500"
            }`}
          >
            {project.status || "Unknown"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Project Name & Description */}
        <div className="space-y-2">
          <h3 className="text-dark100_light900 line-clamp-1 text-xl font-semibold">
            {project.name}
          </h3>
          <p className="text-dark100_light900 line-clamp-2 text-sm">
            {project.description || "No description provided"}
          </p>
        </div>

        {/* Team Section */}
        <div className="space-y-3">
          {/* Team Lead */}
          {teamLead && (
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                {teamLead.image_url ? (
                  <Image
                    src={teamLead.image_url}
                    alt={teamLead.first_name}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <DefaultAvatar size={32} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-dark100_light900 text-xs font-medium">
                  Team Lead
                </span>
                <span className="text-dark100_light900 text-sm">
                  {`${teamLead.first_name} ${teamLead.last_name}`}
                </span>
              </div>
            </div>
          )}

          {/* Team Members */}
          {members.length > 0 && (
            <div className="flex -space-x-2">
              {members.slice(0, 4).map((member) => (
                <div
                  key={member.id}
                  className="relative h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900"
                >
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.first_name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar size={32} />
                  )}
                </div>
              ))}
              {members.length > 4 && (
                <div className="text-dark100_light900 relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 ring-2 ring-white dark:bg-gray-800 dark:ring-zinc-900">
                  <span className="text-xs font-medium">
                    +{members.length - 4}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.github_link && (
            <Link href={project.github_link} target="_blank" className="group">
              <IconGithub className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
            </Link>
          )}
          {project.website_url && (
            <Link href={project.website_url} target="_blank" className="group">
              <IconLink className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
            </Link>
          )}
          {project.figma_link && (
            <Link href={project.figma_link} target="_blank" className="group">
              <IconFigma className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectsCard = ({ projects }: { projects: Project[] }) => {
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

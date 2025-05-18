"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SimpleMemberData,
  updateProjectsSwitch,
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import SwitchStatusButton from "@/Components/ui/SwitchStatusButton";
import { ModalType } from "@/hooks/use-modal-projects";
import { defaultAvatar } from "@/public/assets/images";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import { Project } from "@/types/home/codev";

interface ProjectCardProps {
  project: Project;
  onOpen: (type: ModalType, data: Project) => void;
  categoryId: number | undefined;
}

const ProjectCard = ({ project, onOpen, categoryId }: ProjectCardProps) => {
  const [activeSwitch, setActiveSwitch] = useState<boolean>(
    project.kanban_display,
  );

  const projectStatus =
    project.status &&
    project.status.charAt(0).toUpperCase() + project.status.slice(1);

  const bgProjectStatus =
    project.status === "pending"
      ? "bg-orange-500/80"
      : project.status === "completed"
        ? "bg-green-500/80"
        : project.status === "active"
          ? "bg-blue-500/80"
          : "dark:bg-zinc-700";

  const handleSwitchBtn = async (e: React.MouseEvent): Promise<void> => {
    const { id } = e.currentTarget;
    e.stopPropagation();
    setActiveSwitch(!activeSwitch);
    await updateProjectsSwitch(!activeSwitch, id);
  };

  return categoryId === project.project_category_id ? (
    <div
      onClick={() => onOpen("projectViewModal", project)}
      className="background-box flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 transition-all hover:shadow-lg dark:border-zinc-700 dark:shadow-slate-700 "
    >
      {/* Project Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          alt={`${project.name} image`}
          src={project.main_image || defaultAvatar}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={true}
          className="object-cover"
          loading="eager"
          priority
        />
        <div
          className={`absolute right-2 top-2 flex items-center rounded-xl text-slate-800 transition-all ${bgProjectStatus} dark:text-white`}
        >
          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              project.status === "active"
                ? "text-white-500 bg-green-500/80"
                : project.status === "pending"
                  ? "text-white-500 bg-orange-500/80"
                  : project.status === "completed"
                    ? "text-white-500 bg-blue-500/80"
                    : "text-white-500 bg-gray-500/80"
            }`}
          >
            {project.status === "inprogress"
              ? "In Progress"
              : projectStatus || "Unknown"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Project Name & Description */}
        <div className="space-y-2">
          <div className="flex px-1">
            <div className="w-1/2">
              <h3 className="text-dark100_light900 line-clamp-1 text-xl font-semibold">
                {project.name}
              </h3>
            </div>
            <div className="flex w-1/2 justify-end">
              <SwitchStatusButton
                disabled={false}
                handleSwitch={handleSwitchBtn}
                isActive={activeSwitch}
                id={project.id}
              />
            </div>
          </div>
          <div className="h-12 p-1">
            <p className="text-dark100_light900 line-clamp-2 text-sm">
              {project.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-3">
          {/* Team Lead */}
          {(() => {
            const teamLead = project.project_members?.find(
              (member) => member.role === "team_leader",
            );

            if (!teamLead || !teamLead.codev) return null;

            return (
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                  {teamLead.codev.image_url ? (
                    <Image
                      src={teamLead.codev.image_url}
                      alt={`${teamLead.codev.first_name} ${teamLead.codev.last_name}`}
                      fill
                      unoptimized={true}
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
                    {`${teamLead.codev.first_name} ${teamLead.codev.last_name}`}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Team Members */}
          {project.project_members!?.length > 0 ? (
            <div className="flex -space-x-2">
              {project.project_members!.slice(0, 4).map((member) => (
                <div key={member.id} className="relative h-8 w-8 rounded-full">
                  {member.codev!.image_url ? (
                    <Image
                      src={member.codev!.image_url}
                      alt={`${member.codev!.first_name} ${member.codev!.last_name}`}
                      fill
                      unoptimized={true}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar size={32} />
                  )}
                </div>
              ))}
              {project.project_members!.length > 4 && (
                <div className="text-dark100_light900 relative flex h-8 w-8 items-center justify-center rounded-full dark:bg-gray-800 dark:bg-zinc-700">
                  <span className="text-xs font-medium">
                    +{project.project_members!.length - 4}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex -space-x-2">
              <div className="text-gray relative flex h-8 w-full rounded-full">
                No Members
              </div>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.github_link && (
            <Link
              href={project.github_link}
              target="_blank"
              className="group"
              onClick={(e) => e.stopPropagation()}
            >
              <IconGithub className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
            </Link>
          )}
          {project.website_url && (
            <Link
              href={project.website_url}
              target="_blank"
              className="group"
              onClick={(e) => e.stopPropagation()}
            >
              <IconLink className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
            </Link>
          )}
          {project.figma_link && (
            <Link
              href={project.figma_link}
              target="_blank"
              className="group"
              onClick={(e) => e.stopPropagation()}
            >
              <IconFigma className="size-5 invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0" />
            </Link>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default ProjectCard;

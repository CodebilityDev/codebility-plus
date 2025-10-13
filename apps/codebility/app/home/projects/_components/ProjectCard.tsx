"use client";

import React, { useState, memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SimpleMemberData } from "@/app/home/projects/actions";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import { ModalType } from "@/hooks/use-modal-projects";
import { defaultAvatar } from "@/public/assets/images";
import { IconGithub, IconLink } from "@/public/assets/svgs";
import { IconFigma } from "@/public/assets/svgs/techstack";
import { Project } from "@/types/home/codev";
import { getValidImageUrl } from "@/utils/imageValidation";

import BookmarkButton from "./BookmarkButton";
import ProjectOptionsMenu from "./ProjectOptionsMenu";

export interface ProjectCardProps {
  project: Project;
  onOpen: (type: ModalType, data: Project) => void;
  categoryId: number | undefined;
}

const ProjectCard = ({ project, onOpen, categoryId }: ProjectCardProps) => {
  const projectStatus = useMemo(() =>
    project.status &&
    project.status.charAt(0).toUpperCase() + project.status.slice(1)
  , [project.status]);

  const bgProjectStatus = useMemo(() =>
    project.status === "pending"
      ? "bg-orange-500"
      : project.status === "completed"
        ? "bg-green-500"
        : project.status === "active" || project.status === "inprogress"
          ? "bg-blue-500"
          : "bg-gray-500"
  , [project.status]);

  return (
    <div
      onClick={() => onOpen("projectViewModal", project)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-300 dark:bg-gray-900/50 dark:border-gray-700 dark:hover:border-blue-500/50 backdrop-blur-sm"
    >
      {/* Project Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          alt={`${project.name} image`}
          src={project.main_image || defaultAvatar}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          loading="eager"
          priority
        />
        <div className="absolute right-3 top-3">
          <span
            className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold text-white rounded-full backdrop-blur-sm shadow-lg ${bgProjectStatus}`}
          >
            {project.status === "inprogress"
              ? "In Progress"
              : projectStatus || "Unknown"}
          </span>
        </div>

        <div className="absolute left-3 top-3">
          <BookmarkButton
            project={project}
            categoryId={categoryId}
            onOpen={onOpen}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Main Content */}
        <div className="space-y-3">
          {/* Project Name & Description */}
          <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-gray-900 dark:text-white line-clamp-1 text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.name}
            </h3>
            <ProjectOptionsMenu
              project={project}
              onOpen={onOpen}
              categoryId={categoryId}
            />
          </div>
          <div className="h-10">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm leading-relaxed">
              {project.description || "No description provided"}
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-2">
          {/* Team Lead */}
          {useMemo(() => {
            const teamLead = project.project_members?.find(
              (member) => member.role === "team_leader",
            );

            if (!teamLead || !teamLead.codev) return null;

            return (
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 ring-2 ring-blue-100 dark:ring-blue-900 rounded-full">
                  {(() => {
                    const validUrl = getValidImageUrl(teamLead.codev.image_url);
                    return validUrl ? (
                      <Image
                        src={validUrl}
                        alt={`${teamLead.codev.first_name} ${teamLead.codev.last_name}`}
                        fill
                        sizes="32px"
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <DefaultAvatar size={32} />
                    );
                  })()}
                </div>
                <div className="flex flex-col">
                  <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide">
                    Team Lead
                  </span>
                  <span className="text-gray-900 dark:text-white text-sm font-medium">
                    {`${teamLead.codev.first_name} ${teamLead.codev.last_name}`}
                  </span>
                </div>
              </div>
            );
          }, [project.project_members])}

          {/* Team Members */}
          {project.project_members?.some(
            (member) => member.role === "member",
          ) ? (
            <div className="flex -space-x-2">
              {project.project_members
                .filter((member) => member.role === "member")
                .slice(0, 4)
                .map((member) => (
                  <div
                    key={member.id}
                    className="relative h-8 w-8 rounded-full"
                  >
                    {(() => {
                      const validUrl = getValidImageUrl(member.codev?.image_url);
                      return validUrl ? (
                        <Image
                          src={validUrl}
                          alt={`${member.codev?.first_name} ${member.codev?.last_name}`}
                          fill
                          sizes="32px"
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <DefaultAvatar size={32} />
                      );
                    })()}
                  </div>
                ))}
              {project.project_members.filter(
                (member) => member.role === "member",
              ).length > 4 && (
                <div className="text-dark100_light900 relative flex h-8 w-8 items-center justify-center rounded-full dark:bg-zinc-700">
                  <span className="text-xs font-medium">
                    +
                    {project.project_members.filter(
                      (member) => member.role === "member",
                    ).length - 4}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex -space-x-2">
              <div className="text-gray-600 dark:text-gray-400 relative flex h-8 w-full rounded-full">
                No Members
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 hover:shadow-sm transition-shadow dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:border-blue-700"
                >
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300 dark:border-gray-600">
                  +{project.tech_stack.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 pt-3 mt-auto">
          {project.github_link && (
            <Link
              href={project.github_link}
              target="_blank"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <IconGithub className="size-4 text-gray-600 dark:text-gray-300" />
            </Link>
          )}
          {project.website_url && (
            <Link
              href={project.website_url}
              target="_blank"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <IconLink className="size-4 text-gray-600 dark:text-gray-300" />
            </Link>
          )}
          {project.figma_link && (
            <Link
              href={project.figma_link}
              target="_blank"
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
              onClick={(e) => e.stopPropagation()}
            >
              <IconFigma className="size-4 text-gray-600 dark:text-gray-300" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProjectCard);

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getMembers,
  getTeamLead,
  SimpleMemberData,
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { ModalType } from "@/hooks/use-modal-projects";
import { defaultAvatar } from "@/public/assets/images";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import { Project } from "@/types/home/codev";

interface ProjectCardProps {
  project: Project;
  onOpen: (type: ModalType, data: Project) => void;
}

const ProjectCard = ({ project, onOpen }: ProjectCardProps) => {
  const [teamLead, setTeamLead] = useState<SimpleMemberData | null>(null);
  const [members, setMembers] = useState<SimpleMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!project.id) return;

      setIsLoading(true);
      try {
        // Fetch both team lead and members in parallel
        const [teamLeadResult, membersResult] = await Promise.all([
          getTeamLead(project.id),
          getMembers(project.id),
        ]);

        // Handle team lead data
        if (!teamLeadResult.error && teamLeadResult.data) {
          setTeamLead(teamLeadResult.data);
        }

        // Handle members data
        if (!membersResult.error && membersResult.data) {
          setMembers(membersResult.data);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();

    // Cleanup function
    return () => {
      setTeamLead(null);
      setMembers([]);
    };
  }, [project.id]); // Add proper dependency

  return (
    <div
      onClick={() => onOpen("projectViewModal", project)}
      className="background-box flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-200 transition-all hover:shadow-lg dark:border-zinc-700 dark:shadow-slate-700"
    >
      {/* Project Image */}
      <div className="relative h-48 w-full">
        <Image
          alt={`${project.name} image`}
          src={project.main_image || defaultAvatar}
          fill
          unoptimized={true}
          className="object-cover"
          loading="eager"
          priority
        />
        <div className="absolute right-2 top-2 flex items-center rounded-xl bg-slate-200 px-2 py-1 text-slate-800 transition-all dark:bg-zinc-700 dark:text-white">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              project.status === "active"
                ? "bg-green-500/20 text-green-500"
                : project.status === "pending"
                  ? "bg-orange-500/20 text-orange-500"
                  : project.status === "completed"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-gray-500/20 text-gray-500"
            }`}
          >
            {project.status === "inprogress"
              ? "In Progress"
              : project.status || "Unknown"}
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
          {!isLoading && teamLead && (
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                {teamLead.image_url ? (
                  <Image
                    src={teamLead.image_url}
                    alt={`${teamLead.first_name} ${teamLead.last_name}`}
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
                  {`${teamLead.first_name} ${teamLead.last_name}`}
                </span>
              </div>
            </div>
          )}

          {/* Team Members */}
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-8 w-40 rounded-lg" />
            </>
          ) : (
            members.length > 0 && (
              <div className="flex -space-x-2">
                {members.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="relative h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900"
                  >
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={`${member.first_name} ${member.last_name}`}
                        fill
                        unoptimized={true}
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
            )
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          {project.github_link && (
            <Link
              href={project.github_link}
              target="_blank"
              className="group"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking link
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
  );
};

export default ProjectCard;

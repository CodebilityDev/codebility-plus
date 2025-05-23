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
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { useModal } from "@/hooks/use-modal-projects";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

// Map project category id to a label.
const PROJECT_CATEGORIES: Record<string, string> = {
  "1": "Web Development",
  "2": "Mobile Development",
  "3": "Design",
};

const ProjectViewModal = () => {
  const { isOpen, type, onClose, onOpen, data } = useModal();
  const isModalOpen = isOpen && type === "projectViewModal";

  // Using React Query to fetch team lead data
  const { data: teamLead, isLoading: isTeamLeadLoading } = useQuery({
    queryKey: ["teamLead", data?.id],
    queryFn: async () => {
      if (!data?.id) return null;
      const result = await getTeamLead(data.id);
      return result.data;
    },
    enabled: !!data?.id && isModalOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Using React Query to fetch members data
  const { data: members = [], isLoading: isMembersLoading } = useQuery({
    queryKey: ["members", data?.id],
    queryFn: async () => {
      if (!data?.id) return [];
      const result = await getMembers(data.id);
      return result.data || [];
    },
    enabled: !!data?.id && isModalOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isLoading = isTeamLeadLoading || isMembersLoading;

  // Format dates if available.
  const startDate = data?.start_date
    ? format(parseISO(data.start_date), "MM/dd/yyyy")
    : null;
  const endDate = data?.end_date
    ? format(parseISO(data.end_date), "MM/dd/yyyy")
    : "Ongoing";
  const createdAt = data?.created_at
    ? format(parseISO(data.created_at), "MM/dd/yyyy hh:mm:ss a")
    : null;

  // Image loading optimization
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">View Project</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Project Image with optimized loading */}
          <div className="dark:bg-dark-100 flex justify-center rounded-lg bg-slate-100 p-0">
            {data?.main_image ? (
              <div className="relative h-52 w-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Skeleton className="h-full w-full rounded-lg" />
                  </div>
                )}
                <Image
                  src={data.main_image}
                  alt={data?.name || "Project Image"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`rounded-lg object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  priority
                  onLoad={() => setImageLoaded(true)}
                  unoptimized={true}
                />
              </div>
            ) : (
              <div className="dark:bg-dark-200 flex h-[200px] w-[200px] items-center justify-center rounded-lg bg-gray-200">
                <DefaultAvatar size={120} />
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Details */}
            <div className="dark:bg-dark-200 space-y-4 rounded-lg bg-slate-100 p-4">
              <div>
                <h3 className="text-lg font-semibold">Project Details</h3>
                <p className="text-2xl text-blue-600 dark:text-blue-400">
                  {data?.name}
                </p>
              </div>

              {data?.description && (
                <div>
                  <h4 className="text-sm text-gray-500">Description</h4>
                  <p className="text-sm">{data.description}</p>
                </div>
              )}

              <div className="flex items-center gap-4">
                {data?.github_link && (
                  <Link
                    href={data.github_link}
                    target="_blank"
                    className="flex items-center gap-2 hover:text-blue-500"
                  >
                    <Image
                      src={IconGithub}
                      alt="GitHub"
                      width={20}
                      height={20}
                      className="invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0"
                    />
                    <span className="text-sm">GitHub</span>
                  </Link>
                )}
                {data?.website_url && (
                  <Link
                    href={data.website_url}
                    target="_blank"
                    className="flex items-center gap-2 hover:text-blue-500"
                  >
                    <Image
                      src={IconLink}
                      alt="Website"
                      width={20}
                      height={20}
                      className="invert transition-all group-hover:-translate-y-1 group-hover:text-blue-500 dark:invert-0"
                    />
                    <span className="text-sm">Website</span>
                  </Link>
                )}
                {data?.figma_link && (
                  <Link
                    href={data.figma_link}
                    target="_blank"
                    className="flex items-center gap-2 hover:text-blue-500"
                  >
                    <Image
                      src={IconFigma}
                      alt="Figma"
                      width={20}
                      height={20}
                      className="h-5 w-5 invert dark:invert-0"
                    />
                    <span className="text-sm">Figma</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Project Status */}
            <div className="dark:bg-dark-200 space-y-4 rounded-lg bg-slate-100 p-4">
              <h3 className="text-lg font-semibold">Project Status</h3>

              <div className="grid gap-2">
                <div>
                  <h4 className="text-sm text-gray-500">Current Status</h4>
                  <p className="capitalize text-orange-400">
                    {data?.status === "inprogress"
                      ? "in progress"
                      : data?.status}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">Project Category</h4>
                  <p>
                    {data?.project_category_id
                      ? PROJECT_CATEGORIES[data.project_category_id.toString()]
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">Duration</h4>
                  <p>Start: {startDate}</p>
                  <p>End: {endDate}</p>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500">Created</h4>
                  <p>{createdAt}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Information */}
          <div className="dark:bg-dark-200 space-y-4 rounded-lg bg-slate-100 p-4">
            <h3 className="text-lg font-semibold">Team Information</h3>

            {isLoading ? (
              <>
                <h4 className="text-sm text-gray-500">Team Lead</h4>
                <Skeleton className="h-10 w-48 rounded-lg" />
                <h4 className="text-sm text-gray-500">Team Members</h4>
                <Skeleton className="h-10 w-48 rounded-lg" />
              </>
            ) : (
              <>
                {/* Team Lead */}
                {teamLead && (
                  <div className="space-y-2">
                    <h4 className="text-sm text-gray-500">Team Lead</h4>
                    <div className="flex items-center gap-3">
                      {teamLead.image_url ? (
                        <div className="relative h-12 w-12">
                          <Image
                            src={teamLead.image_url}
                            alt={`${teamLead.first_name} ${teamLead.last_name}`}
                            fill
                            unoptimized={true}
                            className="rounded-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <DefaultAvatar size={48} />
                      )}
                      <div>
                        <p className="font-medium">
                          {teamLead.first_name} {teamLead.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {teamLead.display_position}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Members */}
                {members.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm text-gray-500">Team Members</h4>
                    <div className="flex flex-wrap gap-4">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3"
                        >
                          {member.image_url ? (
                            <div className="relative h-12 w-12">
                              <Image
                                src={member.image_url}
                                alt={`${member.first_name} ${member.last_name}`}
                                fill
                                unoptimized={true}
                                className="rounded-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <DefaultAvatar size={48} />
                          )}
                          <div>
                            <p className="font-medium">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.display_position}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    No team members assigned
                  </div>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button onClick={() => onOpen("projectEditModal", data)}>
              Edit Project
            </Button>
            <Button
              variant="destructive"
              onClick={() => onOpen("projectDeleteModal", data)}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectViewModal;

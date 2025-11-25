"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getMembers,
  getTeamLead,
  SimpleMemberData,
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useModal } from "@/hooks/use-modal-projects";
import { IconGithub, IconLink } from "@/public/assets/svgs";
import { IconFigma } from "@/public/assets/svgs/techstack";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

// Note: Project categories are now fetched directly from the project data
// No need for hardcoded mapping since categories are included in the project object

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
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-lg font-bold">
            Project Details
          </DialogTitle>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Complete overview of the project information and team.
          </p>
        </DialogHeader>

        <div
          className="flex-1 overflow-y-auto p-3"
          style={{ maxHeight: "calc(80vh - 200px)" }}
        >
          <div className="space-y-4">
            {/* Project Image Section */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  1
                </span>
                Project Image
              </h3>
              <div className="flex justify-center">
                {data?.main_image ? (
                  <div className="relative h-64 w-full max-w-md overflow-hidden rounded-lg border-2 border-gray-300 dark:border-gray-600">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                        <Skeleton className="h-full w-full rounded-lg" />
                      </div>
                    )}
                    <Image
                      src={data.main_image}
                      alt={data?.name || "Project Image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`object-cover transition-opacity duration-300 ${
                        imageLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      priority
                      onLoad={() => setImageLoaded(true)}
                    />
                  </div>
                ) : (
                  <div className="flex h-64 w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                    <DefaultAvatar size={80} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No image available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Information Section */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  2
                </span>
                Project Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Project Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Project Name
                    </h4>
                    <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
                      {data?.name}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tagline
                    </h4>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {data?.tagline ||
                        "Innovative solutions for modern challenges"}
                    </p>
                  </div>

                  {data?.description && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Description
                      </h4>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {data.description}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Key Features
                    </h4>
                    <div className="space-y-1">
                      {(data?.key_features && Array.isArray(data.key_features) && data.key_features.length > 0
                        ? data.key_features
                        : [
                            "Responsive Design",
                            "Modern UI/UX",
                            "Cross-platform Compatibility",
                          ]
                      ).map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"></span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* External Links */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      External Links
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {data?.github_link && (
                        <Link
                          href={data.github_link}
                          target="_blank"
                          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <IconGithub className="h-4 w-4 invert dark:invert-0" />
                          <span className="text-sm font-medium">GitHub</span>
                        </Link>
                      )}
                      {data?.website_url && (
                        <Link
                          href={data.website_url}
                          target="_blank"
                          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <IconLink className="h-4 w-4 invert dark:invert-0" />
                          <span className="text-sm font-medium">Website</span>
                        </Link>
                      )}
                      {data?.figma_link && (
                        <Link
                          href={data.figma_link}
                          target="_blank"
                          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                          <IconFigma className="h-4 w-4 invert dark:invert-0" />
                          <span className="text-sm font-medium">Figma</span>
                        </Link>
                      )}
                      {!data?.github_link &&
                        !data?.website_url &&
                        !data?.figma_link && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No external links available
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Project Status & Metadata */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Current Status
                    </h4>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        data?.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : data?.status === "inprogress"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {data?.status === "inprogress"
                        ? "In Progress"
                        : data?.status
                          ? data.status.charAt(0).toUpperCase() +
                            data.status.slice(1)
                          : "Pending"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Project Categories
                    </h4>
                    {data?.categories && data.categories.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {data.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:border-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        Not specified
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Duration
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>Start: {startDate || "Not specified"}</p>
                      <p>End: {endDate}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Created
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {createdAt || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tech Stack Section */}
              {data?.tech_stack && data.tech_stack.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-md mb-4 font-medium text-gray-900 dark:text-gray-100">
                    Technology Stack
                  </h4>
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                    <div className="flex flex-wrap gap-2">
                      {data.tech_stack.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Project Gallery Section */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  3
                </span>
                Project Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {(data?.gallery && Array.isArray(data.gallery) && data.gallery.length > 0
                  ? data.gallery
                  : [data?.main_image]
                )
                  .filter(Boolean)
                  .map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative h-32 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600"
                    >
                      <Image
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Team Information Section */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                  {data?.gallery && data.gallery.length > 0 ? "4" : "3"}
                </span>
                Team Information
              </h3>

              {isLoading ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Team Leader
                    </h4>
                    <Skeleton className="h-16 w-64 rounded-lg" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Team Members
                    </h4>
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-64 rounded-lg" />
                      <Skeleton className="h-16 w-64 rounded-lg" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Team Lead */}
                  {teamLead ? (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Team Leader
                      </h4>
                      <div className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 dark:border-gray-600">
                        {teamLead.image_url ? (
                          <div className="relative h-12 w-12">
                            <Image
                              src={teamLead.image_url}
                              alt={`${teamLead.first_name} ${teamLead.last_name}`}
                              fill
                              className="rounded-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <DefaultAvatar size={48} />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {teamLead.first_name} {teamLead.last_name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {teamLead.display_position || "Team Leader"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Team Leader
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No team leader assigned
                      </p>
                    </div>
                  )}

                  {/* Team Members */}
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Team Members
                    </h4>
                    {members.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-4 rounded-lg border border-gray-300 p-4 dark:border-gray-600"
                          >
                            {member.image_url ? (
                              <div className="relative h-12 w-12">
                                <Image
                                  src={member.image_url}
                                  alt={`${member.first_name} ${member.last_name}`}
                                  fill
                                  className="rounded-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <DefaultAvatar size={48} />
                            )}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {member.first_name} {member.last_name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {member.display_position || "Team Member"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No team members assigned
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t bg-gray-50 pt-4 dark:bg-gray-800/30">
          <div className="flex justify-end gap-3 px-6">
            <Button
              variant="outline"
              onClick={() => onOpen("projectEditModal", data)}
              className="min-w-[100px]"
            >
              Edit Project
            </Button>
            <Button
              variant="destructive"
              onClick={() => onOpen("projectDeleteModal", data)}
              className="min-w-[120px]"
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

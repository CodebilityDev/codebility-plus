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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-lg font-bold">Project Details</DialogTitle>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Complete overview of the project information and team.
          </p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-3" style={{ maxHeight: "calc(80vh - 200px)" }}>
          <div className="space-y-4">
            {/* Project Image Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Project Image
              </h3>
              <div className="flex justify-center">
                {data?.main_image ? (
                  <div className="relative h-64 w-full max-w-md rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
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
                  <div className="h-64 w-full max-w-md rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center gap-3">
                    <DefaultAvatar size={80} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Project Information
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Project Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Name</h4>
                    <p className="text-xl font-medium text-blue-600 dark:text-blue-400">
                      {data?.name}
                    </p>
                  </div>

                  {data?.description && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{data.description}</p>
                    </div>
                  )}

                  {/* External Links */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">External Links</h4>
                    <div className="flex flex-wrap gap-4">
                      {data?.github_link && (
                        <Link
                          href={data.github_link}
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <IconGithub className="h-4 w-4 invert dark:invert-0" />
                          <span className="text-sm font-medium">GitHub</span>
                        </Link>
                      )}
                      {data?.website_url && (
                        <Link
                          href={data.website_url}
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <IconLink className="h-4 w-4 invert dark:invert-0" />
                          <span className="text-sm font-medium">Website</span>
                        </Link>
                      )}
                      {data?.figma_link && (
                        <Link
                          href={data.figma_link}
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <IconFigma className="h-4 w-4 invert dark:invert-0" />
                          <span className="text-sm font-medium">Figma</span>
                        </Link>
                      )}
                      {!data?.github_link && !data?.website_url && !data?.figma_link && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No external links available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Status & Metadata */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      data?.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      data?.status === 'inprogress' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {data?.status === "inprogress" ? "In Progress" : 
                       data?.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : "Pending"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Categories</h4>
                    {data?.categories && data.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {data.categories.map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:border-blue-700"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Not specified</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>Start: {startDate || "Not specified"}</p>
                      <p>End: {endDate}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Created</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{createdAt || "Not available"}</p>
                  </div>
                </div>
              </div>
              
              {/* Tech Stack Section */}
              {data?.tech_stack && data.tech_stack.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">Technology Stack</h4>
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {data.tech_stack.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Team Information Section */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Team Information
              </h3>

              {isLoading ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Team Leader</h4>
                    <Skeleton className="h-16 w-64 rounded-lg" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Team Members</h4>
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
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Team Leader</h4>
                      <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
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
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Team Leader</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No team leader assigned</p>
                    </div>
                  )}

                  {/* Team Members */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Team Members</h4>
                    {members.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-4 p-4 rounded-lg border border-gray-300 dark:border-gray-600"
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
        <div className="border-t pt-4 bg-gray-50 dark:bg-gray-800/30">
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

"use client";

import { useEffect, useState } from "react";
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
import { useModal } from "@/hooks/use-modal-projects";
import { IconFigma, IconGithub, IconLink } from "@/public/assets/svgs";
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

  // Using the simplified member type returned by our actions.
  const [teamLead, setTeamLead] = useState<SimpleMemberData | null>(null);
  const [members, setMembers] = useState<SimpleMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchTeamLeadAndMembers = async () => {
      if (!data) return;
      setIsLoading(true);
      try {
        // Use the project id (data.id) to fetch team data.
        const { error: leadError, data: fetchedTeamLead } = await getTeamLead(
          data.id,
        );
        if (!leadError && fetchedTeamLead) {
          setTeamLead(fetchedTeamLead);
        }

        const { error: membersError, data: fetchedMembers } = await getMembers(
          data.id,
        );
        if (!membersError && fetchedMembers) {
          setMembers(fetchedMembers);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isModalOpen) {
      fetchTeamLeadAndMembers();
    }
  }, [isModalOpen, data]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">View Project</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Project Image */}
          <div className="dark:bg-dark-100 flex justify-center rounded-lg bg-slate-100 p-0">
            {data?.main_image ? (
              <div className="relative h-52 w-full">
                <Image
                  src={data.main_image}
                  alt={data?.name || "Project Image"}
                  fill
                  className="rounded-lg object-cover"
                  priority
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
                    <IconGithub className="h-5 w-5 invert dark:invert-0" />
                    <span className="text-sm">GitHub</span>
                  </Link>
                )}
                {data?.website_url && (
                  <Link
                    href={data.website_url}
                    target="_blank"
                    className="flex items-center gap-2 hover:text-blue-500"
                  >
                    <IconLink className="h-5 w-5 invert dark:invert-0" />
                    <span className="text-sm">Website</span>
                  </Link>
                )}
                {data?.figma_link && (
                  <Link
                    href={data.figma_link}
                    target="_blank"
                    className="flex items-center gap-2 hover:text-blue-500"
                  >
                    <IconFigma className="h-5 w-5 invert dark:invert-0" />
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
                  <p className="capitalize text-orange-400">{data?.status}</p>
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
              <div className="text-sm text-gray-500">
                Loading team information...
              </div>
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
                            className="rounded-full object-cover"
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
                                className="rounded-full object-cover"
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

"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getAllProjects,
  getMembers,
  getProjectCodevs,
  getTeamLead,
  SimpleMemberData,
  updateProjectMembers,
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { MemberSelection } from "@/Components/ui/MemberSelection";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { useModal } from "@/hooks/use-modal-projects";
import { Codev } from "@/types/home/codev";
import toast from "react-hot-toast";

export default function KanbanAddMembersModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "KanbanAddMembersModal";
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [teamLead, setTeamLead] = useState<SimpleMemberData | null>(null);
  const [allUsers, setAllUsers] = useState<Codev[]>([]);
  const pathname = usePathname();
  const kanbanBoardIdFromUrl = pathname?.split("/").pop() || null;

  useEffect(() => {
    if (!isModalOpen) return;

    setIsLoading(true);

    const targetProjectId = selectedProject || kanbanBoardIdFromUrl;

    if (!targetProjectId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch project linked to the kanbanBoardId from URL
        const result = await getAllProjects(kanbanBoardIdFromUrl ?? undefined);

        if (Array.isArray(result) && result.length > 0) {
          setProjects(result);

          // Use fetched project ID as selected project
          const firstProject = result[0] as { id: string };
          setSelectedProject(firstProject.id); // this is the project.id
        } else if (result && typeof result === "object" && "error" in result) {
          toast.error(result.error || "Failed to fetch project");
          return;
        }

        const targetProjectId =
          result &&
          Array.isArray(result) &&
          result[0] &&
          typeof result[0] === "object" &&
          "id" in result[0]
            ? (result[0] as { id: string }).id
            : undefined;

        if (!targetProjectId) {
          toast.error("No valid project ID found.");
          return;
        }

        const [membersResult, users, teamLeadResult] = await Promise.all([
          getMembers(targetProjectId),
          getProjectCodevs(),
          getTeamLead(targetProjectId),
        ]);
        setSelectedMembers(
          Array.isArray(membersResult?.data)
            ? membersResult.data.map((m: any) => ({
                ...m,
                positions: m.positions ?? [],
                tech_stacks: m.tech_stacks ?? [],
              }))
            : [],
        );

        setAllUsers(users || []);

        setTeamLead(
          teamLeadResult?.data
            ? {
                ...(teamLeadResult.data as SimpleMemberData),
                display_position: teamLeadResult.data.display_position,
                role: teamLeadResult.data.role,
              }
            : null,
        );
      } catch (error) {
        toast.error("Failed to load members or team lead.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isModalOpen, selectedProject, kanbanBoardIdFromUrl]);

  const handleAddMember = (member: Codev) => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject) {
      toast.error("Please select a project.");
      return;
    }

    if (!teamLead) {
      toast.error("Team leader is not set.");
      return;
    }

    setIsLoading(true);

    const teamLeaderId = teamLead.id;

    const updatedMembers = [
      {
        ...teamLead,
        positions: (teamLead as any).positions ?? [],
        tech_stacks: (teamLead as any).tech_stacks ?? [],
        display_position: teamLead.display_position ?? undefined,
      },
      ...selectedMembers
        .filter((member) => member.id !== teamLeaderId)
        .map((member) => ({
          ...member,
          display_position: member.display_position ?? undefined,
        })),
    ];

    try {
      const result = await updateProjectMembers(
        selectedProject,
        updatedMembers,
        teamLeaderId,
      );

      if (result.success) {
        toast.success("Project members updated successfully.");
        onClose();
      } else {
        toast.error(result.error || "Failed to update project members.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="mb-8 text-left text-lg">
              Add Members
            </DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="flex max-w-full flex-wrap gap-2">
              {isLoading || !teamLead ? (
                // Show skeleton for whole block OR for teamLead specifically
                <div className="flex flex-col">
                  <label className="dark:text-light-900 text-black">
                    Project Name
                  </label>
                  <Skeleton className="h-12 w-96 rounded-md" />
                  <label className="dark:text-light-900 text-black">
                    Team Leader
                  </label>
                  <Skeleton className="h-12 w-96 rounded-md" />
                  <label className="dark:text-light-900 text-black">
                    Team Members
                  </label>
                  <div className="flex flex-row gap-2">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Project Name */}
                  <div className="flex flex-col gap-2">
                    <label className="dark:text-light-900 text-black">
                      Project Name
                    </label>
                    <div className="mb-4 flex items-center gap-3">
                      {projects.find((p) => p.id === selectedProject)
                        ?.main_image ? (
                        <img
                          src={
                            projects.find((p) => p.id === selectedProject)
                              ?.main_image
                          }
                          alt="Project"
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-gray-300 dark:bg-gray-700" />
                      )}
                      <p className="dark:text-light-900 text-lg text-gray-800">
                        {projects.find((p) => p.id === selectedProject)?.name ??
                          "Unnamed Project"}
                      </p>
                    </div>
                  </div>

                  {/* Team Lead */}
                  <div className="mb-4 w-full">
                    <label className="dark:text-light-900 block text-gray-700">
                      Team Leader
                    </label>
                    <div className="mt-1 flex items-center gap-3">
                      {teamLead.image_url ? (
                        <img
                          src={teamLead.image_url}
                          alt={`${teamLead.first_name} ${teamLead.last_name}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <DefaultAvatar size={48} />
                      )}
                      <div>
                        <p className="font-semibold">{`${teamLead.first_name} ${teamLead.last_name}`}</p>
                        {teamLead.display_position && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {teamLead.display_position}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MemberSelection */}
                  <MemberSelection
                    users={allUsers}
                    selectedMembers={selectedMembers}
                    onMemberAdd={handleAddMember}
                    onMemberRemove={handleRemoveMember}
                  />
                </>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

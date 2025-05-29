"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import { CustomSelect } from "@/Components/ui/CustomSelect";
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

import {
  getAllProjects,
  getMembers,
  getProjectCodevs,
  getTeamLead,
  SimpleMemberData,
  updateProjectMembers,
} from "@/app/home/projects/actions";

export default function KanbanAddMembersModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const isModalOpen = isOpen && type === "KanbanAddMembersModal";
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [teamLead, setTeamLead] = useState<SimpleMemberData | null>(null);
  const [allUsers, setAllUsers] = useState<Codev[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isModalOpen) return;

      if (selectedProject) {
        setIsLoading(true);
      }

      try {
        const result = await getAllProjects();
        if (Array.isArray(result)) {
          setProjects(result);
        } else if (result && typeof result === "object" && "error" in result) {
          toast.error(result.error || "Failed to fetch projects");
        } else {
          toast.error("Failed to fetch projects");
        }
      } catch {
        toast.error("Something went wrong while fetching projects.");
      }

      if (selectedProject) {
        try {
          const [membersResult, users, teamLeadResult] = await Promise.all([
            getMembers(selectedProject),
            getProjectCodevs(),
            getTeamLead(selectedProject),
          ]);

          if (membersResult && Array.isArray(membersResult.data)) {
            setSelectedMembers(
              membersResult.data.map((member: any) => ({
                ...member,
                positions: member.positions ?? [],
                tech_stacks: member.tech_stacks ?? [],
              })),
            );
          } else {
            setSelectedMembers([]);
          }

          setAllUsers(users);
          if (teamLeadResult?.data) {
            setTeamLead({
              ...(teamLeadResult.data as SimpleMemberData),
              display_position: teamLeadResult.data.display_position,
              role: teamLeadResult.data.role,
            });
          } else {
            setTeamLead(null);
          }
        } catch {
          toast.error("Failed to load members or team lead.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [isModalOpen, selectedProject]);

  const handleAddMember = (member: Codev) => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const projectsOptions = useMemo(
    () =>
      projects.map((project) => ({
        id: project.id,
        value: project.id,
        label: project.name,
        imageUrl: project.main_image,
      })),
    [projects],
  );

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
          <CustomSelect
            options={projectsOptions}
            value={selectedProject ?? undefined}
            onChange={(value) => setSelectedProject(value)}
            placeholder="Choose a project"
            label={"Select Project"}
            disabled={isLoading}
            searchable
          />
          {selectedProject && (
            <div className="flex max-w-full flex-wrap gap-2">
              {isLoading ? (
                <div className="flex flex-col">
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
                  {teamLead && (
                    <div className="mb-4 w-full">
                      <label className="dark:text-light-900 block font-medium text-gray-700">
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
                  )}
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

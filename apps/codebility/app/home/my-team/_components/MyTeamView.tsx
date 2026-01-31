"use client";

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { 
  getMembers, 
  getTeamLead, 
  updateProjectMembers,
  SimpleMemberData 
} from "@/app/home/projects/actions";
import { Codev } from "@/types/home/codev";
import { Button } from "@/components/ui/button";
import TeamProjectCard from "./TeamProjectCard";
import AddMembersModal from "../AddMembersModal";

interface ProjectData {
  project: {
    id: string;
    name: string;
  };
  teamLead: {
    data: SimpleMemberData | null;
    error?: string | null;
  };
  members: {
    data: SimpleMemberData[] | null;
    error?: string | null;
  };
}

interface MyTeamViewProps {
  projectData: ProjectData[];
}

const MyTeamView = ({ projectData }: MyTeamViewProps) => {
  const [projects, setProjects] = useState<ProjectData[]>(projectData);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const handleOpenAddModal = useCallback((project: ProjectData) => {
    setSelectedProject(project);
    setShowAddModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setSelectedProject(null);
  }, []);

  const handleUpdateMembers = async (selectedMembers: Codev[]) => {
    if (!selectedProject) {
      toast.error("No project selected");
      return;
    }

    const loadingToast = toast.loading("Updating project members...");

    try {
      setIsLoadingMembers(true);
      
      // Get current team lead with timeout
      const teamLeadPromise = getTeamLead(selectedProject.project.id);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - team lead')), 10000)
      );
      
      const teamLeadResult = await Promise.race([teamLeadPromise, timeoutPromise]);
      const teamLead = teamLeadResult.data;
      
      if (!teamLead) {
        throw new Error('Team leader not found for this project');
      }

      // Validate selected members
      if (!selectedMembers || selectedMembers.length === 0) {
        throw new Error('Please select at least one team member');
      }

      // Prepare updated members array with proper type safety
      const updatedMembers = [
        {
          id: teamLead.id,
          first_name: teamLead.first_name,
          last_name: teamLead.last_name,
          email_address: teamLead.email_address,
          image_url: teamLead.image_url,
          positions: [],
          tech_stacks: [],
          display_position: teamLead.display_position ?? undefined,
        },
        ...selectedMembers
          .filter((member) => member.id !== teamLead.id)
          .map((member) => ({
            id: member.id,
            first_name: member.first_name,
            last_name: member.last_name,
            email_address: member.email_address,
            image_url: member.image_url,
            positions: [],
            tech_stacks: [],
            display_position: member.display_position ?? undefined,
          })),
      ];

      // Update project members with timeout
      const updatePromise = updateProjectMembers(
        selectedProject.project.id,
        updatedMembers,
        teamLead.id,
      );
      
      const updateTimeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - update members')), 15000)
      );

      const result = await Promise.race([updatePromise, updateTimeoutPromise]);

      if (result.success) {
        toast.success("Team members updated successfully!", { id: loadingToast });
        
        // Update local state with new members
        const updatedProjectMembers: SimpleMemberData[] = selectedMembers
          .filter(member => member.id !== teamLead.id)
          .map(member => ({
            id: member.id,
            first_name: member.first_name,
            last_name: member.last_name,
            email_address: member.email_address,
            image_url: member.image_url ?? null,
            role: 'member' as const,
            display_position: member.display_position ?? null,
            joined_at: new Date().toISOString(),
          }));

        setProjects(prev => prev.map(p => 
          p.project.id === selectedProject.project.id 
            ? { 
                ...p, 
                members: { 
                  data: updatedProjectMembers,
                  error: null 
                } 
              }
            : p
        ));
        
        handleCloseModal();
      } else {
        const errorMsg = result.error || "Failed to update project members";
        console.error('Update members error:', errorMsg);
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to update members:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while updating members";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Handle empty or invalid project data
  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 bg-white/20 backdrop-blur-md dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl shadow-lg">
        <div className="text-5xl">👥</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          No teams found
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
          You are not assigned to any projects yet. Contact your project manager to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((projectItem) => {
          // Show error state for individual projects if needed
          const hasError = projectItem.members.error || projectItem.teamLead.error;
          
          return (
            <TeamProjectCard
              key={projectItem.project.id}
              project={projectItem}
              onAddMembers={() => handleOpenAddModal(projectItem)}
              isLoading={isLoadingMembers && selectedProject?.project.id === projectItem.project.id}
            />
          );
        })}
      </div>

      {/* Add Members Modal */}
      {selectedProject && showAddModal && (
        <AddMembersModal
          isOpen={showAddModal}
          projectData={selectedProject}
          onClose={handleCloseModal}
          onUpdate={handleUpdateMembers}
        />
      )}
    </>
  );
};

export default MyTeamView;
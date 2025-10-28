"use client";

import { useState } from "react";
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
// NOTE: ChecklistManageModal is REMOVED from project card view
// It will only be accessible from project detail page

interface ProjectData {
  project: {
    id: string;
    name: string;
  };
  teamLead: {
    data: SimpleMemberData;
  };
  members: {
    data: SimpleMemberData[];
  };
}

interface MyTeamViewProps {
  projectData: ProjectData[];
}

const MyTeamView = ({ projectData }: MyTeamViewProps) => {
  const [projects, setProjects] = useState(projectData);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const handleOpenAddModal = (project: ProjectData) => {
    setSelectedProject(project);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedProject(null);
  };

  const handleUpdateMembers = async (selectedMembers: Codev[]) => {
    if (!selectedProject) return;

    try {
      setIsLoadingMembers(true);
      
      // Get current team lead
      const teamLeadResult = await getTeamLead(selectedProject.project.id);
      const teamLead = teamLeadResult.data;
      
      if (!teamLead) {
        throw new Error('Team leader not found');
      }

      // Prepare updated members array
      const updatedMembers = [
        {
          ...teamLead,
          positions: [],
          tech_stacks: [],
          display_position: teamLead.display_position ?? undefined,
        },
        ...selectedMembers
          .filter((member) => member.id !== teamLead.id)
          .map((member) => ({
            ...member,
            display_position: member.display_position ?? undefined,
          })),
      ];

      // Update project members
      const result = await updateProjectMembers(
        selectedProject.project.id,
        updatedMembers,
        teamLead.id,
      );

      if (result.success) {
        toast.success("Project members updated successfully.");
        
        // Update local state
        const updatedProjectMembers: SimpleMemberData[] = selectedMembers
          .filter(member => member.id !== teamLead.id)
          .map(member => ({
            id: member.id,
            first_name: member.first_name,
            last_name: member.last_name,
            email_address: member.email_address,
            image_url: member.image_url ?? null,
            role: 'member',
            display_position: member.display_position ?? null,
            joined_at: new Date().toISOString(),
          }));

        setProjects(prev => prev.map(p => 
          p.project.id === selectedProject.project.id 
            ? { ...p, members: { data: updatedProjectMembers } }
            : p
        ));
        
        handleCloseModal();
      } else {
        toast.error(result.error || "Failed to update project members.");
      }
    } catch (error) {
      console.error('Failed to update members:', error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  if (!projects?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 bg-white/20 backdrop-blur-md dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-2xl shadow-lg">
        <div className="text-4xl">👥</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No teams found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          You are not assigned to any projects yet
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((projectItem) => (
          <TeamProjectCard
            key={projectItem.project.id}
            project={projectItem}
            onAddMembers={() => handleOpenAddModal(projectItem)}
            isLoading={isLoadingMembers}
          />
        ))}
      </div>

      {/* Add Members Modal */}
      {selectedProject && (
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
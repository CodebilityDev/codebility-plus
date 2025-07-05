// my-team/MyTeamPage.tsx - Fixed Role/Position contrast for dark mode
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { 
  getMembers, 
  getProjectCodevs, 
  getTeamLead, 
  updateProjectMembers,
  SimpleMemberData 
} from "@/app/home/projects/actions";
import { Codev } from "@/types/home/codev";
import AddMembersModal from "./AddMembersModal";

// Use imported SimpleMemberData type instead of declaring locally
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

interface MyTeamPageProps {
  projectData: ProjectData[];
}

// Single utility function for name formatting
const formatName = (firstName: string, lastName: string): string => 
  `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

// Consolidated member display component - FIXED role/position contrast
const MemberCard = ({ member, isLead = false }: { member: SimpleMemberData; isLead?: boolean }) => {
  const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";
  const displayName = formatName(member.first_name, member.last_name);
  
  if (isLead) {
    return (
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={displayName}
            width={48}
            height={48}
            className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 transition-colors duration-200"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
              inset: "0px",
              color: "transparent",
            }}
          />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-white transition-colors duration-200">
            Team Lead
          </span>
          <span className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">
            {displayName}
          </span>
          {member.display_position && (
            <span 
              className="text-xs"
              style={{ 
                color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
                  ? '#e5e7eb' 
                  : '#6b7280'
              }}
            >
              {member.display_position}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={displayName}
          width={48}
          height={48}
          className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 transition-colors duration-200"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
            color: "transparent",
          }}
        />
      </div>
      <span className="text-[10px] sm:text-xs text-gray-900 dark:text-white font-semibold text-center leading-tight block px-1 transition-colors duration-200">
        {displayName}
      </span>
      {member.display_position && (
        <span 
          className="text-[8px] sm:text-[9px] text-center font-normal italic"
          style={{ 
            color: typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches 
              ? '#e5e7eb' 
              : '#6b7280'
          }}
        >
          {member.display_position}
        </span>
      )}
    </div>
  );
};

// Main component
const MyTeamPage = ({ projectData }: MyTeamPageProps) => {
  const [projects, setProjects] = useState(projectData);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<Codev[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const handleOpenAddModal = async (project: ProjectData) => {
    setSelectedProject(project);
    setIsLoadingMembers(true);
    
    try {
      // Fetch available members using Kanban pattern
      const users = await getProjectCodevs();
      setAvailableMembers(users || []);
      setShowAddModal(true);
    } catch (error) {
      console.error('Failed to fetch available members:', error);
      toast.error('Failed to load available members');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedProject(null);
    setAvailableMembers([]);
  };

  const handleUpdateMembers = async (selectedMembers: Codev[]) => {
    if (!selectedProject) return;

    try {
      // Get current team lead
      const teamLeadResult = await getTeamLead(selectedProject.project.id);
      const teamLead = teamLeadResult.data;
      
      if (!teamLead) {
        throw new Error('Team leader not found');
      }

      // Prepare updated members array using Kanban pattern
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

      // Update using the same function as Kanban
      const result = await updateProjectMembers(
        selectedProject.project.id,
        updatedMembers,
        teamLead.id,
      );

      if (result.success) {
        toast.success("Project members updated successfully.");
        
        // Update local state - convert Codev[] to SimpleMemberData[]
        const updatedProjectMembers: SimpleMemberData[] = selectedMembers
          .filter(member => member.id !== teamLead.id)
          .map(member => ({
            id: member.id,
            first_name: member.first_name,
            last_name: member.last_name,
            email_address: member.email_address,
            image_url: member.image_url ?? null, // Convert undefined to null
            role: 'member',
            display_position: member.display_position ?? null, // Convert undefined to null
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
    }
  };

  if (!projects?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-white dark:bg-gray-900 p-6">
        <div className="text-center max-w-md">
          <p className="text-gray-600 dark:text-gray-400">
            You are not assigned to any projects yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Contact your project manager to get assigned to a team.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-200">
              Codebility Portal
            </h1>
          </div>

          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 2xl:gap-6">
            {projects.map((projectItem) => {
              const { project, teamLead, members } = projectItem;
              
              return (
                <div
                  key={project.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 h-full"
                >
                  <div className="space-y-4 sm:space-y-5 md:space-y-6">
                    
                    {/* Project Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                          {project.name}
                        </h2>
                        <button
                          onClick={() => handleOpenAddModal(projectItem)}
                          disabled={isLoadingMembers}
                          className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium border border-blue-300 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoadingMembers ? 'Loading...' : 'Add Members'}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-white mb-4 sm:mb-5 md:mb-6 transition-colors duration-200">
                        {members.data.length} member{members.data.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Team Lead */}
                    {teamLead.data && (
                      <div className="space-y-2 sm:space-y-3">
                        <MemberCard member={teamLead.data} isLead />
                      </div>
                    )}

                    {/* Team Members */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-200">
                        Team Members
                      </h3>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="grid grid-cols-4 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                          {members.data.map((member) => (
                            <MemberCard key={member.id} member={member} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Members Modal using Kanban pattern */}
      {selectedProject && (
        <AddMembersModal
          isOpen={showAddModal}
          projectData={selectedProject}
          availableMembers={availableMembers}
          onClose={handleCloseModal}
          onUpdate={handleUpdateMembers}
        />
      )}
    </>
  );
};

export default MyTeamPage;

// Export types for reusability
export type { ProjectData };
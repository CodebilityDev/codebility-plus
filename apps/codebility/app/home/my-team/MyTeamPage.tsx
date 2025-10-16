// my-team/MyTeamPage.tsx - Proper Client-Side Implementation
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { 
  getMembers, 
  getProjectCodevs, 
  getTeamLead, 
  updateProjectMembers,
  SimpleMemberData 
} from "@/app/home/projects/actions";
import { Codev, InternalStatus } from "@/types/home/codev";
import { useModal } from "@/hooks/use-modal-users";
import { createClientClientComponent } from "@/utils/supabase/client";
import AddMembersModal from "./AddMembersModal";

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

// ✅ CLIENT-SIDE: Calculate years from work experience
const calculateYearsFromExperience = (workExperience: any[]): number => {
  if (!workExperience || workExperience.length === 0) return 0;
  
  let totalYears = 0;
  workExperience.forEach(exp => {
    if (exp.date_from) {
      const startDate = new Date(exp.date_from);
      const endDate = exp.is_present ? new Date() : (exp.date_to ? new Date(exp.date_to) : new Date());
      const yearsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      totalYears += Math.max(0, yearsDiff);
    }
  });
  
  return Math.round(totalYears);
};

// Enhanced member display component with profile click
const MemberCard = ({ 
  member, 
  isLead = false,
  onProfileClick
}: { 
  member: SimpleMemberData; 
  isLead?: boolean;
  onProfileClick?: (member: Codev) => void;
}) => {
  const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";
  const displayName = formatName(member.first_name, member.last_name);
  
  // ✅ FIXED: Basic conversion with proper InternalStatus typing
  const convertToCodev = (simpleMember: SimpleMemberData): Codev => {
    return {
      id: simpleMember.id,
      first_name: simpleMember.first_name,
      last_name: simpleMember.last_name,
      email_address: simpleMember.email_address,
      display_position: simpleMember.display_position ?? undefined,
      image_url: simpleMember.image_url ?? undefined,
      availability_status: true, // Fallback
      internal_status: 'GRADUATED' as InternalStatus, // ✅ Proper type casting
      years_of_experience: 0, // Fallback
      about: undefined,
      education: [],
      work_experience: [],
      projects: [],
      tech_stacks: [],
      codev_points: [],
      positions: [],
      github: undefined,
      linkedin: undefined,
      facebook: undefined,
      discord: undefined,
      phone_number: undefined,
      address: undefined,
      role_id: undefined
    } as Codev;
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onProfileClick) {
      onProfileClick(convertToCodev(member));
    }
  };
  
  if (isLead) {
    return (
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div 
          className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-customBlue-300 transition-all duration-200 rounded-full overflow-hidden"
          onClick={handleAvatarClick}
          title="Click to view profile"
        >
          <Image
            src={imageUrl}
            alt={displayName}
            width={48}
            height={48}
            className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 transition-colors duration-200"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
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
      <div 
        className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-customBlue-300 transition-all duration-200 rounded-full overflow-hidden"
        onClick={handleAvatarClick}
        title="Click to view profile"
      >
        <Image
          src={imageUrl}
          alt={displayName}
          width={48}
          height={48}
          className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 transition-colors duration-200"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
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
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // ✅ FIXED: Initialize Supabase client safely following project pattern
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  // Modal hook for profile integration
  const { onOpen: openProfileModal } = useModal();

  // ✅ FIXED: Enhanced profile fetching function with proper Supabase handling
  const getCompleteCodevProfileSafe = async (codevId: string): Promise<Codev | null> => {
    try {
      if (!supabase) {
        console.error('Supabase client not available');
        return null;
      }
      
      const { data, error } = await supabase
        .from("codev")
        .select(`
          *,
          education:education(*),
          work_experience:work_experience(*),
          projects:project_members(
            project:project_id(*)
          ),
          codev_points:codev_points(*)
        `)
        .eq('id', codevId)
        .single();

      if (error || !data) {
        console.error('Error fetching complete profile:', error);
        return null;
      }

      // ✅ Handle years_of_experience calculation
      let finalYearsOfExperience = data.years_of_experience;
      
      // If years_of_experience is null/undefined, calculate from work experience
      if (finalYearsOfExperience === null || finalYearsOfExperience === undefined) {
        finalYearsOfExperience = calculateYearsFromExperience(data.work_experience || []);
        console.log(`🔧 Calculated years from work experience: ${finalYearsOfExperience}`);
      }

      // ✅ FIXED: Proper type casting for InternalStatus
      const safeInternalStatus = data.internal_status as InternalStatus | undefined;

      // ✅ Create enhanced profile with proper years_of_experience and types
      const enhancedProfile: Codev = {
        ...data,
        years_of_experience: finalYearsOfExperience,
        internal_status: safeInternalStatus,
        work_experience: data.work_experience || [],
        education: data.education || [],
        projects: data.projects || [],
        codev_points: data.codev_points || [],
        tech_stacks: data.tech_stacks || [],
        positions: data.positions || []
      };

      console.log('✅ FIXED PROFILE DATA:', {
        id: enhancedProfile.id,
        name: `${enhancedProfile.first_name} ${enhancedProfile.last_name}`,
        availability_status: enhancedProfile.availability_status,
        internal_status: enhancedProfile.internal_status,
        years_of_experience: enhancedProfile.years_of_experience, // ✅ Should now work
        years_source: data.years_of_experience !== null ? 'database' : 'calculated',
        work_experience_count: enhancedProfile.work_experience?.length || 0 // ✅ Safe optional chaining
      });

      return enhancedProfile;
    } catch (error) {
      console.error('Failed to fetch complete profile:', error);
      return null;
    }
  };

  // ✅ FIXED: Client-side profile click handler with proper type safety
  const handleProfileClick = async (member: Codev) => {
    try {
      console.log('🔍 Fetching profile data for:', member.id);
      
      // Step 1: Try to fetch complete profile data using safe method
      const completeProfile = await getCompleteCodevProfileSafe(member.id);
      
      if (completeProfile) {
        console.log('✅ Successfully fetched complete profile');
        openProfileModal("profileModal", completeProfile);
      } else {
        console.warn('❌ Using fallback profile data');
        // ✅ FIXED: Proper fallback with correct InternalStatus typing
        const fallbackProfile: Codev = {
          ...member,
          years_of_experience: 0,
          availability_status: true,
          internal_status: 'GRADUATED' as InternalStatus // ✅ Explicit type casting
        };
        openProfileModal("profileModal", fallbackProfile);
      }
    } catch (error) {
      console.error('❌ Error in profile click handler:', error);
      // ✅ FIXED: Final fallback with safe typing
      const safeFallback: Codev = {
        ...member,
        years_of_experience: 0,
        availability_status: true,
        internal_status: 'GRADUATED' as InternalStatus // ✅ Explicit type casting
      };
      openProfileModal("profileModal", safeFallback);
    }
  };

  const handleOpenAddModal = async (project: ProjectData) => {
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

      // Update using the existing function
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
    }
  };

  if (!projects?.length) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-white/20 backdrop-blur-md dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-lg p-6">
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
      <div className="min-h-screen bg-gradient-to-br from-customBlue-50 via-white to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-customBlue-950 dark:to-purple-950 transition-colors duration-200">
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
                  className="rounded-xl bg-white/20 backdrop-blur-md dark:bg-white/10 border border-white/30 dark:border-white/20 p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/30 dark:hover:bg-white/15 hover:border-white/40 dark:hover:border-white/30 h-full">
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
                          className="px-3 py-1 text-sm text-customBlue-600 dark:text-customBlue-400 hover:text-customBlue-800 dark:hover:text-customBlue-300 font-medium border border-customBlue-300 dark:border-customBlue-500 rounded-lg hover:bg-customBlue-50 dark:hover:bg-customBlue-900/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <MemberCard 
                          member={teamLead.data} 
                          isLead 
                          onProfileClick={handleProfileClick}
                        />
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
                            <MemberCard 
                              key={member.id} 
                              member={member} 
                              onProfileClick={handleProfileClick}
                            />
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

export default MyTeamPage;

// Export types for reusability
export type { ProjectData };
"use client";

import { useState, useEffect, useMemo } from "react";
import { SimpleMemberData, getProjectCodevs, updateProjectMembers } from "@/app/home/projects/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Codev, InternalStatus } from "@/types/home/codev";
import { Search, Check, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useModal } from "@/hooks/use-modal-users";
import { createClientClientComponent } from "@/utils/supabase/client";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: {
    project: { id: string; name: string };
    teamLead: { data: SimpleMemberData | null };
    members: { data: SimpleMemberData[] | null };
  };
  onUpdate: (selectedMembers: Codev[]) => void;
}

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

// Line 25: Responsive Avatar Component with Profile Click
const TeamMemberAvatar = ({ 
  imageUrl, 
  name, 
  position,
  size = 32,
  member,
  onClick
}: { 
  imageUrl?: string | null; 
  name: string; 
  position?: string;
  size?: number;
  member?: Codev;
  onClick?: (member: Codev) => void;
}) => (
  <div className="flex flex-col items-center space-y-1 w-full"> 
    <div 
      className={`relative flex-shrink-0 rounded-full overflow-hidden ring-1 sm:ring-2 ring-customBlue-400 ${
        member && onClick ? 'cursor-pointer hover:ring-customBlue-300 transition-all duration-200' : ''
      }`}
      style={{ width: size, height: size }}
      onClick={(e) => {
        e.stopPropagation();
        if (member && onClick) {
          onClick(member);
        }
      }}
      title={member ? "Click to view profile" : undefined}
    >
      <img
        src={
          imageUrl ||
          "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
        }
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
        }}
      />
    </div>
    <div className="text-center w-full">
      <div className="text-xs text-white font-medium truncate w-full leading-tight mt-2">
        {name}
      </div>
      {position && (
        <div className="text-xs text-gray-300 truncate w-full leading-tight hidden sm:block">
          {position}
        </div>
      )}
    </div>
  </div>
);

// ✅ FIXED: Team Leader Display with real data handling
const TeamLeaderDisplay = ({ 
  teamLead,
  onProfileClick
}: { 
  teamLead: SimpleMemberData | null;
  onProfileClick?: (member: Codev) => void;
}) => (
  <div>
    <h4 className="text-base sm:text-lg font-semibold text-white mb-3">Team Leader</h4>
    {teamLead ? (
      <div className="flex items-center gap-2 sm:gap-3 mb-6">
        <div 
          className={`relative flex-shrink-0 rounded-full overflow-hidden ring-2 ring-customBlue-400 mb-3 ${
            onProfileClick ? 'cursor-pointer hover:ring-customBlue-300 transition-all duration-200' : ''
          }`}
          style={{ width: 40, height: 40 }}
          onClick={(e) => {
            e.stopPropagation();
            if (onProfileClick && teamLead) {
              // ✅ Create basic Codev object - real data will be fetched by handleProfileClick
              const basicCodev: Codev = {
                id: teamLead.id,
                first_name: teamLead.first_name,
                last_name: teamLead.last_name,
                email_address: teamLead.email_address,
                display_position: teamLead.display_position ?? undefined,
                image_url: teamLead.image_url ?? undefined,
                // ✅ Fix 3: Use proper default values with correct typing
                availability_status: undefined,
                internal_status: undefined, // Will be fetched with real data
                years_of_experience: undefined,
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
              };
              
              onProfileClick(basicCodev);
            }
          }}
          title={onProfileClick ? "Click to view profile" : undefined}
        >
          <img
            src={
              teamLead.image_url ||
              "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
            }
            alt={`${teamLead.first_name} ${teamLead.last_name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
            }}
          />
        </div>
        <div>
          <div className="text-white font-semibold text-sm sm:text-base mt-[-7px]">
            {teamLead.first_name} {teamLead.last_name}
          </div>
          <div className="text-gray-300 text-xs sm:text-sm">
            {teamLead.display_position || 'CEO / Founder'}
          </div>
        </div>
      </div>
    ) : (
      <div className="text-gray-400 text-sm sm:text-base">No team leader assigned</div>
    )}
  </div>
);

// Line 125: Enhanced Responsive Team Grid with Profile Click
const TeamMembersGrid = ({ 
  members,
  currentMemberIds,
  onProfileClick
}: { 
  members: Codev[];
  currentMemberIds: string[];
  onProfileClick?: (member: Codev) => void;
}) => {
  const getAvatarSize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 28;
      if (window.innerWidth < 1024) return 32;
      return 36;
    }
    return 32;
  };

  return (
    <div className="h-full flex flex-col">
      <h4 className="text-base sm:text-lg font-semibold text-white mb-1">Team Members</h4>
      <div className="mb-1 sm:mb-2">
        <span className="text-white text-xs sm:text-sm">{members.length} members</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 sm:gap-2 w-full mt-6">
        {members.map((member) => {
          const isNew = !currentMemberIds.includes(member.id);
          return (
            <div key={member.id} className="w-full flex flex-col items-center relative mb-5">
              {isNew && (
                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 rounded-full z-10">
                  New
                </div>
              )}
              <TeamMemberAvatar
                imageUrl={member.image_url}
                name={member.first_name}
                position={member.display_position}
                size={getAvatarSize()}
                member={member}
                onClick={onProfileClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Line 160: Project Preview with Enhanced Profile Click Support
const ProjectPreview = ({ 
  projectName, 
  teamLead, 
  selectedMembers,
  currentMemberIds,
  onProfileClick
}: { 
  projectName: string; 
  teamLead: SimpleMemberData | null;
  selectedMembers: Codev[];
  currentMemberIds: string[];
  onProfileClick?: (member: Codev) => void;
}) => (
  <div className="h-full flex flex-col p-1 sm:p-2 space-y-1">
    <div className="flex-shrink-0 mb-5">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-3">Project Name</h3>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex items-center justify-center bg-customBlue-600">
          <img
            src="https://codebility-cdn.pages.dev/assets/images/logo.png"
            alt="Codebility Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src.includes('logo.png')) {
                target.src = "https://codebility-cdn.pages.dev/assets/images/codebility.png";
              } else if (target.src.includes('codebility.png')) {
                target.src = "https://codebility-cdn.pages.dev/assets/images/brand/logo.png";
              } else {
                target.style.display = 'none';
                target.parentElement!.innerHTML = '<div class="w-8 h-8 sm:w-12 sm:h-12 bg-customBlue-600 rounded-lg flex items-center justify-center"><div class="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded text-white font-bold flex items-center justify-center text-xs">C</div></div>';
              }
            }}
          />
        </div>
        <span className="text-white text-base sm:text-xl font-medium truncate">{projectName}</span>
      </div>
    </div>
    
    <div className="flex-shrink-0">
      <TeamLeaderDisplay 
        teamLead={teamLead} 
        onProfileClick={onProfileClick}
      />
    </div>
    
    <div className="flex-1 min-h-0 mr-8">
      <TeamMembersGrid 
        members={selectedMembers} 
        currentMemberIds={currentMemberIds}
        onProfileClick={onProfileClick}
      />
    </div>
  </div>
);

// ✅ FIXED: Main Modal Component with Real Database Profile Integration
const AddMembersModal = ({ 
  isOpen, 
  onClose, 
  projectData,
  onUpdate 
}: AddMembersModalProps) => {
  const { project, teamLead, members } = projectData;
  const teamLeadData = teamLead.data;
  const currentMembers = members.data ?? [];

  // ✅ FIXED: Initialize Supabase client safely following project pattern
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  // Line 214: Modal hook for profile integration
  const { onOpen: openProfileModal } = useModal();

  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<Codev[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

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
      
      if (finalYearsOfExperience === null || finalYearsOfExperience === undefined) {
        finalYearsOfExperience = calculateYearsFromExperience(data.work_experience || []);
      }

      // ✅ Fix 2: Proper type casting for InternalStatus
      const safeInternalStatus = data.internal_status as InternalStatus | undefined;
      
      // ✅ Return REAL database values with proper typing
      const enhancedProfile: Codev = {
        ...data,
        years_of_experience: finalYearsOfExperience,
        internal_status: safeInternalStatus, // ✅ Properly typed
        work_experience: data.work_experience || [],
        education: data.education || [],
        projects: data.projects || [],
        codev_points: data.codev_points || [],
        tech_stacks: data.tech_stacks || [],
        positions: data.positions || []
      };

      console.log('✅ AddMembersModal - REAL DATABASE VALUES:', {
        id: enhancedProfile.id,
        name: `${enhancedProfile.first_name} ${enhancedProfile.last_name}`,
        availability_status: enhancedProfile.availability_status,
        internal_status: enhancedProfile.internal_status,
        years_of_experience: enhancedProfile.years_of_experience,
        years_source: data.years_of_experience !== null ? 'database' : 'calculated'
      });

      return enhancedProfile;
    } catch (error) {
      console.error('Failed to fetch complete profile:', error);
      return null;
    }
  };

  // ✅ FIXED: Profile click handler with REAL database values and proper error handling
  const handleProfileClick = async (member: Codev) => {
    try {
      console.log('🔍 AddMembersModal - Fetching real profile data for:', member.id);
      
      // Step 1: Fetch complete real profile data using safe method
      const completeProfile = await getCompleteCodevProfileSafe(member.id);
      
      if (completeProfile) {
        console.log('✅ AddMembersModal - Opening ProfileModal with REAL values');
        openProfileModal("profileModal", completeProfile);
      } else {
        console.warn('❌ AddMembersModal - Using fallback data');
        // ✅ Fix 4: Proper fallback with correct InternalStatus typing
        const fallbackProfile: Codev = {
          ...member,
          years_of_experience: 0,
          availability_status: member.availability_status ?? true,
          internal_status: (member.internal_status as InternalStatus) ?? 'GRADUATED'
        };
        openProfileModal("profileModal", fallbackProfile);
      }
    } catch (error) {
      console.error('❌ AddMembersModal - Error in profile click handler:', error);
      // ✅ Final fallback with safe typing
      const safeFallback: Codev = {
        ...member,
        years_of_experience: 0,
        availability_status: true,
        internal_status: 'GRADUATED' as InternalStatus
      };
      openProfileModal("profileModal", safeFallback);
    }
  };

  // Line 226: Load available members
  useEffect(() => {
    const loadMembers = async () => {
      if (!isOpen) return;
      
      setIsLoadingMembers(true);
      try {
        const users = await getProjectCodevs();
        setAvailableMembers(users || []);
      } catch (error) {
        console.error('Failed to fetch members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoadingMembers(false);
      }
    };

    loadMembers();
  }, [isOpen]);

  // Line 243: Initialize selected members
  useEffect(() => {
    if (isOpen && currentMembers && availableMembers.length > 0) {
      const currentMemberIds = currentMembers.map(m => m.id);
      const preSelected = availableMembers.filter(user => 
        currentMemberIds.includes(user.id)
      );
      setSelectedMembers(preSelected);
    }
  }, [isOpen, currentMembers, availableMembers]);

  // Calculate newly selected members (not already in the team)
  const newlySelectedMembers = useMemo(() => {
    const currentMemberIds = currentMembers.map(m => m.id);
    return selectedMembers.filter(member => !currentMemberIds.includes(member.id));
  }, [selectedMembers, currentMembers]);

  // Line 253: Member selection logic
  const toggleMember = (member: Codev) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      return isSelected 
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member];
    });
  };

  const isSelected = (userId: string) => selectedMembers.some(m => m.id === userId);
  const isCurrentMember = (userId: string) => currentMembers.some(m => m.id === userId);

  // Line 264: Filter available members - Optimize with better filtering
  const filteredUsers = useMemo(() => {
    if (!availableMembers.length) return [];
    
    const searchLower = searchQuery.toLowerCase().trim();
    
    return availableMembers.filter(user => {
      if (!user?.id || !user?.first_name || !user?.last_name) return false;
      
      const isTeamLead = teamLeadData?.id === user.id;
      if (isTeamLead) return false;
      
      if (!searchLower) return true;
      
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const position = user.display_position?.toLowerCase() || '';
      
      return fullName.includes(searchLower) || position.includes(searchLower);
    });
  }, [availableMembers, teamLeadData, searchQuery]);

  // Line 278: Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedMembers([]);
    }
  }, [isOpen]);

  // Line 285: Submit handler
  const handleSubmit = async () => {
    if (!teamLeadData) {
      toast.error('Team leader not found');
      return;
    }

    setIsUpdating(true);
    try {
      const updatedMembers = [
        {
          ...teamLeadData,
          positions: [],
          tech_stacks: [],
          display_position: teamLeadData.display_position ?? undefined,
        },
        ...selectedMembers
          .filter((member) => member.id !== teamLeadData.id)
          .map((member) => ({
            ...member,
            display_position: member.display_position ?? undefined,
          })),
      ];

      const result = await updateProjectMembers(
        project.id,
        updatedMembers,
        teamLeadData.id,
      );

      if (result.success) {
        toast.success("Project members updated successfully");
        await onUpdate(selectedMembers);
        onClose();
      } else {
        toast.error(result.error || "Failed to update members");
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full w-[85vw] sm:w-[80vw] lg:w-[80vw] h-[80vh] p-0 flex flex-col dark:bg-slate-950
        border-2 border-slate-300 dark:border-blue-900/60 ">
        <DialogHeader className="flex-shrink-0 px-3 sm:px-6 pt-1 pb-1 ">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            Add Members
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
          {/* Left Panel - 60% on Desktop */}
          <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-white/30 dark:border-white/20">
            <ProjectPreview 
              projectName={project.name}
              teamLead={teamLeadData}
              selectedMembers={selectedMembers}
              currentMemberIds={currentMembers.map(m => m.id)}
              onProfileClick={handleProfileClick}
            />
          </div>

          {/* Right Panel - 40% on Desktop */}
          <div className="w-full lg:w-2/5 flex flex-col min-h-0">
            <div className="flex-shrink-0 px-3 sm:px-6 pt-3 sm:pt-6 pb-4">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-customBlue-400" />
                <span className="truncate">Available Members ({newlySelectedMembers.length} new selected)</span>
              </h3>
              
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white/20 backdrop-blur-sm dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue-500 focus:border-white/50 transition-colors text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="flex-1 px-3 sm:px-6 pb-4 overflow-y-auto min-h-0">
              <div className="space-y-2 sm:space-y-3">
                {isLoadingMembers ? (
                  <div className="text-center py-6 sm:py-8 text-gray-400">
                    Loading members...
                  </div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.slice(0, 50).map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleMember(user)}
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected(user.id) 
                          ? 'bg-gray-700/50 ring-1 ring-customBlue-500' 
                          : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div 
                          className={`relative rounded-full overflow-hidden ring-2 transition-all duration-200 cursor-pointer hover:ring-customBlue-300 ${
                            isSelected(user.id) 
                              ? 'ring-customBlue-500' 
                              : 'ring-customBlue-400'
                          }`}
                          style={{ width: 40, height: 40 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProfileClick(user);
                          }}
                          title="Click to view profile"
                        >
                          <img
                            src={
                              user.image_url ||
                              "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                            }
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm sm:text-base truncate">
                          {user.first_name} {user.last_name}
                          {isCurrentMember(user.id) && (
                            <span className="ml-2 text-xs text-gray-400">(Current member)</span>
                          )}
                        </div>
                        {user.display_position && (
                          <div className="text-gray-300 text-xs sm:text-sm truncate">
                            {user.display_position}
                          </div>
                        )}
                      </div>
                      
                      {/* ✅ Fixed checkbox with proper contrast */}
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected(user.id) 
                            ? 'bg-white border-white' 
                            : 'bg-transparent border-gray-400'
                        }`}>
                          {isSelected(user.id) && (
                            <span 
                              style={{ 
                                color: 'rgb(0, 0, 0)',
                                fontSize: '16px', 
                                fontWeight: '900',
                                lineHeight: '1',
                                display: 'block',
                                textAlign: 'center'
                              }}
                            >
                              &#10003;
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-400 text-sm sm:text-base">
                    {searchQuery ? "No members found" : "No available members"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 p-3 sm:p-6 ">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
            className="w-full sm:flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating || isLoadingMembers}
            className="w-full sm:flex-1 bg-customBlue-600 hover:bg-customBlue-700 text-white border-0"
          >
            {isUpdating ? "Updating..." : "Update Members"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
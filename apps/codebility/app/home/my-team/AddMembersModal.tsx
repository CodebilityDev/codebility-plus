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
import { Codev } from "@/types/home/codev";
import { Search, Check, Users } from "lucide-react";
import toast from "react-hot-toast";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: {
    project: { id: string; name: string };
    teamLead: { data: SimpleMemberData };
    members: { data: SimpleMemberData[] };
  };
  onUpdate: (selectedMembers: Codev[]) => void;
}

// Line 25: Responsive Avatar Component
const TeamMemberAvatar = ({ 
  imageUrl, 
  name, 
  position,
  size = 32
}: { 
  imageUrl?: string | null; 
  name: string; 
  position?: string;
  size?: number;
}) => (
  <div className="flex flex-col items-center space-y-1 w-full"> 
    <div 
      className="relative flex-shrink-0 rounded-full overflow-hidden ring-1 sm:ring-2 ring-blue-400"
      style={{ width: size, height: size }}
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
      <div className="text-xs text-white font-medium truncate w-full leading-tight">
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

// Line 63: Team Leader Display Component
const TeamLeaderDisplay = ({ 
  teamLead 
}: { 
  teamLead: SimpleMemberData | null;
}) => (
  <div>
    <h4 className="text-base sm:text-lg font-semibold text-white mb-1">Team Leader</h4>
    {teamLead ? (
      <div className="flex items-center gap-2 sm:gap-3">
        <div 
          className="relative flex-shrink-0 rounded-full overflow-hidden ring-2 ring-blue-400"
          style={{ width: 40, height: 40 }}
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
          <div className="text-white font-semibold text-sm sm:text-base">
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

// Line 101: Enhanced Responsive Team Grid
const TeamMembersGrid = ({ 
  members 
}: { 
  members: Codev[];
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 sm:gap-2 w-full">
        {members.map((member) => (
          <div key={member.id} className="w-full flex flex-col items-center">
            <TeamMemberAvatar
              imageUrl={member.image_url}
              name={member.first_name}
              position={member.display_position}
              size={getAvatarSize()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Line 124: Project Preview with Codebility Logo
const ProjectPreview = ({ 
  projectName, 
  teamLead, 
  selectedMembers
}: { 
  projectName: string; 
  teamLead: SimpleMemberData | null;
  selectedMembers: Codev[];
}) => (
  <div className="h-full flex flex-col p-1 sm:p-2 space-y-1">
    <div className="flex-shrink-0">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Project Name</h3>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex items-center justify-center bg-blue-600">
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
                target.parentElement!.innerHTML = '<div class="w-8 h-8 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center"><div class="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded text-white font-bold flex items-center justify-center text-xs">C</div></div>';
              }
            }}
          />
        </div>
        <span className="text-white text-base sm:text-xl font-medium truncate">{projectName}</span>
      </div>
    </div>
    
    <div className="flex-shrink-0">
      <TeamLeaderDisplay teamLead={teamLead} />
    </div>
    
    <div className="flex-1 min-h-0">
      <TeamMembersGrid members={selectedMembers} />
    </div>
  </div>
);

// Line 150: Main Modal Component - OPTIMIZED SIZE
const AddMembersModal = ({ 
  isOpen, 
  onClose, 
  projectData,
  onUpdate 
}: AddMembersModalProps) => {
  const { project, teamLead, members } = projectData;
  const teamLeadData = teamLead.data;
  const currentMembers = members.data;

  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<Codev[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Line 162: Load available members
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

  // Line 179: Initialize selected members
  useEffect(() => {
    if (isOpen && currentMembers && availableMembers.length > 0) {
      const currentMemberIds = currentMembers.map(m => m.id);
      const preSelected = availableMembers.filter(user => 
        currentMemberIds.includes(user.id)
      );
      setSelectedMembers(preSelected);
    }
  }, [isOpen, currentMembers, availableMembers]);

  // Line 189: Member selection logic
  const toggleMember = (member: Codev) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      return isSelected 
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member];
    });
  };

  const isSelected = (userId: string) => selectedMembers.some(m => m.id === userId);

  // Line 200: Filter available members
  const filteredUsers = useMemo(() => {
    if (!availableMembers.length) return [];
    
    return availableMembers.filter(user => {
      if (!user?.id || !user?.first_name || !user?.last_name) return false;
      
      const isTeamLead = teamLeadData?.id === user.id;
      const matchesSearch = !searchQuery.trim() || 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.display_position?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return !isTeamLead && matchesSearch;
    });
  }, [availableMembers, teamLeadData, searchQuery]);

  // Line 214: Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedMembers([]);
    }
  }, [isOpen]);

  // Line 221: Submit handler
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
      {/* OPTIMIZED MODAL SIZE: Reduced from 95vw to 85vw/80vw and 90vh to 80vh */}
      <DialogContent className="max-w-full w-[85vw] sm:w-[80vw] lg:w-[80vw] h-[80vh] p-0 flex flex-col bg-gray-800">
        <DialogHeader className="flex-shrink-0 px-3 sm:px-6 pt-1 pb-1 border-b border-gray-700 bg-gray-800">
          <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
            Add Members
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden bg-gray-800">
          {/* Left Panel - 60% on Desktop */}
          <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-gray-700 bg-gray-800">
            <ProjectPreview 
              projectName={project.name}
              teamLead={teamLeadData}
              selectedMembers={selectedMembers}
            />
          </div>

          {/* Right Panel - 40% on Desktop */}
          <div className="w-full lg:w-2/5 flex flex-col min-h-0 bg-gray-800">
            <div className="flex-shrink-0 px-3 sm:px-6 pt-3 sm:pt-6 pb-4">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <span className="truncate">Team Members ({selectedMembers.length} selected)</span>
              </h3>
              
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base"
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
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleMember(user)}
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected(user.id) 
                          ? 'bg-gray-700/50 ring-1 ring-blue-500' 
                          : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        <div 
                          className={`relative rounded-full overflow-hidden ring-2 transition-all duration-200 ${
                            isSelected(user.id) 
                              ? 'ring-blue-500' 
                              : 'ring-blue-400'
                          }`}
                          style={{ width: 40, height: 40 }}
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
                        </div>
                        {user.display_position && (
                          <div className="text-gray-300 text-xs sm:text-sm truncate">
                            {user.display_position}
                          </div>
                        )}
                      </div>
                      
                      {/* FINAL FIX: White background with RGB black checkmark */}
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

        <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3 p-3 sm:p-6 border-t border-gray-700 bg-gray-800">
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
            className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
          >
            {isUpdating ? "Updating..." : "Update Members"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
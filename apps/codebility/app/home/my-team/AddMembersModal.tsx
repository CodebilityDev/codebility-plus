"use client";

import { useState, useEffect, useMemo } from "react";
import { SimpleMemberData, getProjectCodevs, updateProjectMembers } from "@/app/home/projects/actions";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Codev } from "@/types/home/codev";
import { Search, X, Check, Users, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

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

// Line 25: Avatar using simple img tag to avoid Next.js domain restrictions
const MemberAvatar = ({ 
  imageUrl, 
  name, 
  size = 48,
  selected = false 
}: { 
  imageUrl?: string | null; 
  name: string; 
  size?: number;
  selected?: boolean;
}) => (
  <div 
    className={`relative flex-shrink-0 rounded-full overflow-hidden transition-all duration-200 ${
      selected ? 'ring-3 ring-blue-500' : 'ring-2 ring-gray-200 dark:ring-gray-600'
    }`}
    style={{ width: size, height: size }}
  >
    <img
      src={
        imageUrl ||
        "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
      }
      alt={name}
      className="w-full h-full object-cover rounded-full"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
      }}
    />
  </div>
);

// Line 51: Search input with proper dark mode visibility
const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search members..." 
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="relative mb-4">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-4 w-4" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    />
  </div>
);

// Line 70: Project preview section
const ProjectPreview = ({ 
  projectName, 
  teamLead, 
  currentMembers 
}: { 
  projectName: string; 
  teamLead: SimpleMemberData | null;
  currentMembers: SimpleMemberData[];
}) => (
  <div className="space-y-6">
    {/* Project Name */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Project Name</h3>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
        </div>
        <span className="text-gray-900 dark:text-white text-lg font-medium">{projectName}</span>
      </div>
    </div>
    
    {/* Team Leader */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Team Leader</h4>
      {teamLead ? (
        <div className="flex items-center gap-3">
          <MemberAvatar
            imageUrl={teamLead.image_url}
            name={`${teamLead.first_name} ${teamLead.last_name}`}
            size={48}
          />
          <div>
            <div className="text-gray-900 dark:text-white font-medium">
              {teamLead.first_name} {teamLead.last_name}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {teamLead.display_position || 'Team Leader'}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400">No team leader assigned</div>
      )}
    </div>
    
    {/* Current Members */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Members</h4>
      <div className="flex items-center gap-2 flex-wrap">
        {currentMembers.slice(0, 3).map((member) => (
          <MemberAvatar
            key={member.id}
            imageUrl={member.image_url}
            name={`${member.first_name} ${member.last_name}`}
            size={40}
          />
        ))}
        {currentMembers.length > 3 && (
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
            +{currentMembers.length - 3}
          </div>
        )}
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-500">
          <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </div>
  </div>
);

// Line 128: Main component
const AddMembersModal = ({ 
  isOpen, 
  onClose, 
  projectData,
  onUpdate 
}: AddMembersModalProps) => {
  const { project, teamLead, members } = projectData;
  const teamLeadData = teamLead.data;
  const currentMembers = members.data;

  // State
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<Codev[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // Line 143: Load members
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

  // Line 160: Initialize selected members
  useEffect(() => {
    if (isOpen && currentMembers && availableMembers.length > 0) {
      const currentMemberIds = currentMembers.map(m => m.id);
      const preSelected = availableMembers.filter(user => 
        currentMemberIds.includes(user.id)
      );
      setSelectedMembers(preSelected);
    }
  }, [isOpen, currentMembers, availableMembers]);

  // Line 170: Toggle selection
  const toggleMember = (member: Codev) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      return isSelected 
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member];
    });
  };

  const isSelected = (userId: string) => selectedMembers.some(m => m.id === userId);

  // Line 181: Filter members
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

  // Line 195: Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedMembers([]);
    }
  }, [isOpen]);

  // Line 202: Submit handler
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
      <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Members
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Main Content - Fixed height with proper flex */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Panel */}
          <div className="w-2/5 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <ProjectPreview 
              projectName={project.name}
              teamLead={teamLeadData}
              currentMembers={currentMembers}
            />
          </div>

          {/* Right Panel */}
          <div className="w-3/5 flex flex-col min-h-0">
            {/* Header section */}
            <div className="flex-shrink-0 p-6 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Team Members ({selectedMembers.length} selected)
              </h3>
              
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* Scrollable member list */}
            <div className="flex-1 px-6 pb-4 overflow-y-auto min-h-0">
              <div className="space-y-2">
                {isLoadingMembers ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Loading members...
                  </div>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleMember(user)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected(user.id) 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
                      }`}
                    >
                      <MemberAvatar
                        imageUrl={user.image_url}
                        name={`${user.first_name} ${user.last_name}`}
                        size={40}
                        selected={isSelected(user.id)}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 dark:text-white font-medium truncate">
                          {user.first_name} {user.last_name}
                        </div>
                        {user.display_position && (
                          <div className="text-gray-600 dark:text-gray-400 text-sm truncate">
                            {user.display_position}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected(user.id) 
                            ? 'bg-blue-500 border-blue-400' 
                            : 'bg-white border-gray-400 dark:bg-gray-500 dark:border-gray-300'
                        }`}>
                          {isSelected(user.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No members found" : "No available members"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating || isLoadingMembers}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? "Updating..." : "Update Members"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
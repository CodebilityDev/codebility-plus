// apps/codebility/app/home/my-team/AddMembersModal.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { SimpleMemberData } from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
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
  availableMembers: Codev[];
  onUpdate: (selectedMembers: Codev[]) => void;
}

// Member Avatar Component - Matches your existing design
const MemberAvatar = ({ 
  imageUrl, 
  name, 
  size = 48 
}: { 
  imageUrl?: string | null; 
  name: string; 
  size?: number;
}) => (
  <div 
    className="relative flex-shrink-0 rounded-full overflow-hidden"
    style={{ width: size, height: size }}
  >
    <Image
      src={
        imageUrl ||
        "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
      }
      alt={name}
      width={size}
      height={size}
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
);

// Search Input Component
const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Search members..." 
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// Project Preview Component - Matches your left panel design
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
    {/* Project Info */}
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Project Name</h3>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
        </div>
        <span className="text-white text-lg">{projectName}</span>
      </div>
    </div>
    
    {/* Team Leader */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-3">Team Leader</h4>
      {teamLead ? (
        <div className="flex items-center gap-3">
          <MemberAvatar
            imageUrl={teamLead.image_url}
            name={`${teamLead.first_name} ${teamLead.last_name}`}
            size={48}
          />
          <div>
            <div className="text-white font-medium">
              {teamLead.first_name} {teamLead.last_name}
            </div>
            <div className="text-gray-400 text-sm">
              {teamLead.display_position || teamLead.role || 'CEO / Founder'}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-400">No team leader assigned</div>
      )}
    </div>
    
    {/* Current Team Members */}
    <div>
      <h4 className="text-lg font-semibold text-white mb-3">Team Members</h4>
      <div className="flex items-center gap-2">
        {currentMembers.slice(0, 3).map((member) => (
          <MemberAvatar
            key={member.id}
            imageUrl={member.image_url}
            name={`${member.first_name} ${member.last_name}`}
            size={48}
          />
        ))}
        <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-500">
          <Plus className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  </div>
);

const AddMembersModal = ({ 
  isOpen, 
  onClose, 
  projectData,
  availableMembers,
  onUpdate 
}: AddMembersModalProps) => {
  // Extract data from props
  const { project, teamLead, members } = projectData;
  const teamLeadData = teamLead.data;
  const currentMembers = members.data;

  // State management
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Toggle member selection
  const toggleMember = (member: Codev) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      return isSelected 
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member];
    });
  };

  // Check if member is selected
  const isSelected = (userId: string) => selectedMembers.some(m => m.id === userId);

  // Initialize selected members when modal opens
  useEffect(() => {
    if (isOpen && currentMembers && availableMembers) {
      const currentMemberIds = currentMembers.map(m => m.id);
      const preSelected = availableMembers.filter(user => 
        currentMemberIds.includes(user.id)
      );
      setSelectedMembers(preSelected);
    }
  }, [isOpen, currentMembers, availableMembers]);

  // Filter available users
  const filteredUsers = useMemo(() => {
    if (!availableMembers || availableMembers.length === 0) {
      return [];
    }
    
    return availableMembers.filter(user => {
      // Ensure user has required properties
      if (!user || !user.id || !user.first_name || !user.last_name) {
        return false;
      }
      
      const isTeamLead = teamLeadData?.id === user.id;
      const matchesSearch = searchQuery.trim() === "" || 
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.display_position?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      return !isTeamLead && matchesSearch;
    });
  }, [availableMembers, teamLeadData, searchQuery]);

  // Clean up on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedMembers([]);
    }
  }, [isOpen]);

  // Submit handler
  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(selectedMembers);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        {/* Header Section */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-white">
              Add Members
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex h-full">
          {/* Left Panel - Project Preview */}
          <div className="w-1/2 p-6 border-r border-gray-700">
            <ProjectPreview 
              projectName={project.name}
              teamLead={teamLeadData}
              currentMembers={currentMembers}
            />
          </div>

          {/* Right Panel - Member Selection */}
          <div className="w-1/2 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members ({selectedMembers.length} selected)
              </h3>
              
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search members..."
              />
            </div>

            {/* Member Selection List */}
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleMember(user)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                    >
                      {/* Inline Avatar */}
                      <div 
                        className="relative flex-shrink-0 rounded-full overflow-hidden"
                        style={{ width: 40, height: 40 }}
                      >
                        <img
                          src={
                            user.image_url ||
                            "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                          }
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-full h-full object-cover ring-2 ring-gray-200 dark:ring-gray-600 transition-colors duration-200"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {user.first_name} {user.last_name}
                        </div>
                        {user.display_position && (
                          <div className="text-gray-400 text-sm truncate">
                            {user.display_position}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 border-2 rounded ${
                          isSelected(user.id) 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-400'
                        }`}>
                          {isSelected(user.id) && (
                            <Check className="w-3 h-3 text-white m-0.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {availableMembers.length === 0 
                      ? "No members available" 
                      : searchQuery 
                        ? "No members found matching your search" 
                        : "No available members"}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
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
                disabled={isUpdating}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
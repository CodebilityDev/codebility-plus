// apps/codebility/app/home/my-team/AddMembersModal.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  getTeamLead, 
  getMembers, 
  getProjectCodevs, 
  updateProjectMembers,
  SimpleMemberData 
} from "@/app/home/projects/actions";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { Codev } from "@/types/home/codev";
import { Search, X, Check } from "lucide-react";
import toast from "react-hot-toast";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onUpdate?: () => void;
}

const AddMembersModal = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName, 
  onUpdate 
}: AddMembersModalProps) => {
  const [currentMembers, setCurrentMembers] = useState<SimpleMemberData[]>([]);
  const [teamLead, setTeamLead] = useState<SimpleMemberData | null>(null);
  const [availableUsers, setAvailableUsers] = useState<Codev[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load data when modal opens
  useEffect(() => {
    if (!isOpen || !projectId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [membersResult, teamLeadResult, usersResult] = await Promise.all([
          getMembers(projectId),
          getTeamLead(projectId),
          getProjectCodevs()
        ]);

        setCurrentMembers(membersResult.data || []);
        setTeamLead(teamLeadResult.data);
        setAvailableUsers(usersResult || []);
        
        // Pre-select current members
        if (membersResult.data) {
          const currentMemberIds = membersResult.data.map(m => m.id);
          const preSelected = (usersResult || []).filter(user => 
            currentMemberIds.includes(user.id)
          );
          setSelectedMembers(preSelected);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load team data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen, projectId]);

  // Filter available users (exclude team lead and search)
  const filteredUsers = availableUsers.filter(user => {
    const isTeamLead = teamLead?.id === user.id;
    const matchesSearch = searchQuery.trim() === "" || 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.display_position?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    return !isTeamLead && matchesSearch;
  });

  const toggleMember = (member: Codev) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      return isSelected 
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member];
    });
  };

  const handleSubmit = async () => {
    if (!teamLead) return;
    
    setIsUpdating(true);
    try {
      // updateProjectMembers expects Codev[], not SimpleMemberData[]
      const result = await updateProjectMembers(
        projectId,
        selectedMembers, // Pass selectedMembers directly as Codev[]
        teamLead.id
      );

      if (result.success) {
        toast.success("Team members updated successfully");
        onUpdate?.();
        onClose();
      } else {
        toast.error(result.error || "Failed to update team members");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const isSelected = (userId: string) => selectedMembers.some(m => m.id === userId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        {/* Header */}
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
          {/* Left Panel - Project Info */}
          <div className="w-1/2 p-6 border-r border-gray-700">
            {isLoading ? (
              <div className="space-y-6">
                <div>
                  <label className="text-gray-400 text-sm font-medium">Project Name</label>
                  <Skeleton className="h-12 w-full mt-2" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium">Team Leader</label>
                  <Skeleton className="h-16 w-full mt-2" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm font-medium">Team Members</label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-12 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-2">
                    Project Name
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-white text-lg font-medium">{projectName}</span>
                  </div>
                </div>

                {/* Team Leader */}
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-2">
                    Team Leader
                  </label>
                  {teamLead && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {teamLead.image_url ? (
                          <img
                            src={teamLead.image_url}
                            alt={`${teamLead.first_name} ${teamLead.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar size={48} />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {teamLead.first_name} {teamLead.last_name}
                        </div>
                        {teamLead.display_position && (
                          <div className="text-gray-400 text-sm">
                            {teamLead.display_position}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Team Members Grid */}
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-2">
                    Team Members
                  </label>
                  <div className="space-y-3">
                    {/* Selected Members Grid */}
                    <div className="grid grid-cols-6 gap-1">
                      {selectedMembers.slice(0, 12).map((member) => (
                        <div key={member.id} className="relative">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                            {member.image_url ? (
                              <img
                                src={member.image_url}
                                alt={`${member.first_name} ${member.last_name}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <DefaultAvatar size={48} />
                            )}
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ))}
                      {/* Plus indicator for more */}
                      {selectedMembers.length > 12 && (
                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-white text-lg">+</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Member count */}
                    <div className="text-gray-400 text-sm">
                      {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Available Members */}
          <div className="w-1/2 p-6 flex flex-col">
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Available Members List */}
            <div className="flex-1 overflow-y-auto">
              <h3 className="text-gray-400 text-sm font-medium mb-4">Available Members</h3>
              
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                      onClick={() => toggleMember(user)}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        {user.image_url ? (
                          <img
                            src={user.image_url}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar size={48} />
                        )}
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
                  ))}
                  
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      {searchQuery ? "No members found matching your search" : "No available members"}
                    </div>
                  )}
                </div>
              )}
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
                disabled={isLoading || isUpdating}
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
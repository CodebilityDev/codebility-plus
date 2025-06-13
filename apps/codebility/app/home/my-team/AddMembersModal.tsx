// apps/codebility/app/home/my-team/AddMembersModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { Codev } from "@/types/home/codev";
import { Search, X, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onUpdate?: () => void;
}

// Member card component for selection
const MemberCard = ({ 
  member, 
  isSelected, 
  onToggle 
}: { 
  member: Codev; 
  isSelected: boolean; 
  onToggle: (member: Codev) => void;
}) => (
  <div 
    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
      isSelected 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}
    onClick={() => onToggle(member)}
  >
    <div className="relative h-12 w-12 flex-shrink-0">
      {member.image_url ? (
        <Image
          src={member.image_url}
          alt={`${member.first_name} ${member.last_name}`}
          fill
          unoptimized={true}
          className="rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <DefaultAvatar size={48} />
      )}
    </div>
    
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
        {member.first_name} {member.last_name}
      </p>
      {member.display_position && (
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {member.display_position}
        </p>
      )}
    </div>
    
    <div className="flex-shrink-0">
      {isSelected ? (
        <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Minus className="h-4 w-4 text-white" />
        </div>
      ) : (
        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </div>
      )}
    </div>
  </div>
);

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
    if (teamLead && user.id === teamLead.id) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        (user.display_position && user.display_position.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Toggle member selection
  const toggleMember = (member: Codev) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!teamLead) {
      toast.error("Team leader is required");
      return;
    }

    setIsUpdating(true);
    try {
      await updateProjectMembers(projectId, selectedMembers, teamLead.id);
      toast.success("Team members updated successfully");
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error updating members:", error);
      toast.error("Failed to update team members");
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedMembers([]);
      setCurrentMembers([]);
      setTeamLead(null);
      setAvailableUsers([]);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Add Members to {projectName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Team Lead Display */}
          {teamLead && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                TEAM LEAD
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12">
                  {teamLead.image_url ? (
                    <Image
                      src={teamLead.image_url}
                      alt={`${teamLead.first_name} ${teamLead.last_name}`}
                      fill
                      unoptimized={true}
                      className="rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <DefaultAvatar size={48} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {teamLead.first_name} {teamLead.last_name}
                  </p>
                  {teamLead.display_position && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {teamLead.display_position}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Available Members
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedMembers.length} selected
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <MemberCard
                      key={user.id}
                      member={user}
                      isSelected={selectedMembers.some(m => m.id === user.id)}
                      onToggle={toggleMember}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No members found matching your search" : "No available members"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Members"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
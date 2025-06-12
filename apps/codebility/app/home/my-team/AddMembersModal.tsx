// app/home/my-team/AddMembersModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { SimpleMemberData } from "@/app/home/projects/actions";
import { Codev } from "@/types/home/codev";

// Types matching your MyTeamPage
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

interface AddMembersModalProps {
  isOpen: boolean;
  projectData: ProjectData;
  availableMembers: Codev[];
  onClose: () => void;
  onUpdate: (selectedMembers: Codev[]) => Promise<void>;
}

// Name formatting utility matching your existing code
const formatName = (firstName: string, lastName: string): string => 
  `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

const AddMembersModal = ({ isOpen, projectData, availableMembers, onClose, onUpdate }: AddMembersModalProps) => {
  const [selectedMembers, setSelectedMembers] = useState<Codev[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize selected members when modal opens
  useEffect(() => {
    if (isOpen && projectData.members.data && availableMembers.length > 0) {
      // Find current members in availableMembers to get full Codev objects
      const currentMembers: Codev[] = projectData.members.data
        .map(member => {
          const fullMember = availableMembers.find(am => am.id === member.id);
          return fullMember || null;
        })
        .filter((member): member is Codev => member !== null);
      
      setSelectedMembers(currentMembers);
      setSearchQuery("");
    }
  }, [isOpen, projectData.members.data, availableMembers]);

  // Filter available members based on search
  const filteredMembers = availableMembers.filter(member =>
    formatName(member.first_name, member.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.display_position && member.display_position.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleMemberSelection = (member: Codev) => {
    setSelectedMembers(prev => {
      const isSelected = prev.some(m => m.id === member.id);
      if (isSelected) {
        return prev.filter(m => m.id !== member.id);
      } else {
        return [...prev, member];
      }
    });
  };

  const isSelected = (memberId: string) => {
    return selectedMembers.some(m => m.id === memberId);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(selectedMembers);
    } catch (error) {
      console.error('Failed to update members:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] flex overflow-hidden">
        
        {/* Left Panel - Project Info & Selected Members */}
        <div className="w-1/2 p-6 border-r border-gray-700 flex flex-col">
          
          {/* Project Name */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm mb-2">Project Name</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                  {projectData.project.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-white text-xl font-semibold">{projectData.project.name}</h2>
            </div>
          </div>

          {/* Team Leader */}
          {projectData.teamLead.data && (
            <div className="mb-6">
              <h3 className="text-gray-400 text-sm mb-3">Team Leader</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center flex-shrink-0">
                  {projectData.teamLead.data.image_url ? (
                    <Image
                      src={projectData.teamLead.data.image_url}
                      alt={formatName(projectData.teamLead.data.first_name, projectData.teamLead.data.last_name)}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {projectData.teamLead.data.first_name.charAt(0).toUpperCase()}
                      {projectData.teamLead.data.last_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {formatName(projectData.teamLead.data.first_name, projectData.teamLead.data.last_name)}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {projectData.teamLead.data.display_position || 'Team Leader'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Members */}
          <div className="flex-1">
            <h3 className="text-gray-400 text-sm mb-3">Team Members</h3>
            <div className="grid grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto">
              {selectedMembers.slice(0, 8).map(member => (
                <div key={member.id} className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center border-2 border-blue-500">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={formatName(member.first_name, member.last_name)}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {member.first_name.charAt(0).toUpperCase()}
                        {member.last_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
              {selectedMembers.length > 8 && (
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">+{selectedMembers.length - 8}</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm">{selectedMembers.length} members selected</p>
          </div>
        </div>

        {/* Right Panel - Available Members */}
        <div className="w-1/2 p-6 flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">Add Members</h2>
            <button 
              onClick={handleClose} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Available Members List */}
          <div className="mb-4">
            <h3 className="text-gray-400 text-sm mb-3">Available Members</h3>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto pr-2">
            {filteredMembers.map(member => {
              const memberIsSelected = isSelected(member.id);
              
              return (
                <div 
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => toggleMemberSelection(member)}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center flex-shrink-0">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={formatName(member.first_name, member.last_name)}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {member.first_name.charAt(0).toUpperCase()}
                        {member.last_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {formatName(member.first_name, member.last_name)}
                    </div>
                    <div className="text-gray-400 text-sm truncate">
                      {member.display_position || 'Team Member'}
                    </div>
                  </div>
                  <div className={`w-5 h-5 border-2 rounded transition-colors ${
                    memberIsSelected 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-400 hover:border-gray-300'
                  }`}>
                    {memberIsSelected && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
            <button 
              onClick={handleClose}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:text-white hover:border-gray-500 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;
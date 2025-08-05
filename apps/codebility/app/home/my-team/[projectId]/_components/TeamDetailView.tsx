"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  getMembers, 
  getTeamLead, 
  updateProjectMembers,
  SimpleMemberData 
} from "@/app/home/projects/actions";
import { Codev } from "@/types/home/codev";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, UserPlus, Mail, Calendar } from "lucide-react";
import DefaultAvatar from "@/components/DefaultAvatar";
import AddMembersModal from "../../AddMembersModal";

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

interface TeamDetailViewProps {
  projectData: ProjectData;
}

const formatName = (firstName: string, lastName: string): string => 
  `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return 'Unknown';
  }
};

const MemberCard = ({ member, isLead = false }: { member: SimpleMemberData; isLead?: boolean }) => {
  const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";
  const displayName = formatName(member.first_name, member.last_name);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-4">
        <div className="relative" style={{ width: 64, height: 64 }}>
          {member.image_url ? (
            <Image
              src={imageUrl}
              alt={displayName}
              width={64}
              height={64}
              className="rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-600"
            />
          ) : (
            <div className="rounded-full ring-2 ring-gray-200 dark:ring-gray-600">
              <DefaultAvatar size={64} />
            </div>
          )}
          {isLead && (
            <div className="absolute -bottom-1 -right-1 rounded-full bg-customBlue-500 px-2 py-1">
              <span className="text-xs font-semibold text-white">LEAD</span>
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {displayName}
              </h3>
              {member.display_position && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {member.display_position}
                </p>
              )}
            </div>
            {isLead && (
              <div className="rounded-full bg-customBlue-100 px-3 py-1 dark:bg-customBlue-900/30">
                <span className="text-xs font-medium text-customBlue-800 dark:text-customBlue-200">
                  Team Lead
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4" />
              <span>{member.email_address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDate(member.joined_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamDetailView = ({ projectData }: TeamDetailViewProps) => {
  const [project, setProject] = useState(projectData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const { project: projectInfo, teamLead, members } = project;
  const totalMembers = members.data.length + (teamLead.data ? 1 : 0);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleUpdateMembers = async (selectedMembers: Codev[]) => {
    try {
      setIsLoadingMembers(true);
      
      // Get current team lead
      const teamLeadResult = await getTeamLead(projectInfo.id);
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
        projectInfo.id,
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

        setProject(prev => ({
          ...prev,
          members: { data: updatedProjectMembers }
        }));
        
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

  return (
    <>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/home/my-team"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Team
            </Link>
          </div>
          <Button
            onClick={handleOpenAddModal}
            disabled={isLoadingMembers}
            size="sm"
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {isLoadingMembers ? 'Loading...' : 'Add Members'}
          </Button>
        </div>

        {/* Project stats */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-gray-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Team Overview
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalMembers} total member{totalMembers !== 1 ? 's' : ''} • {members.data.length} team member{members.data.length !== 1 ? 's' : ''} + 1 lead
              </p>
            </div>
          </div>
        </div>

        {/* Team Lead Section */}
        {teamLead.data && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Team Lead
            </h3>
            <MemberCard member={teamLead.data} isLead />
          </div>
        )}

        {/* Team Members Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {members.data.length} member{members.data.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {members.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {members.data.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 dark:border-gray-700">
              <UserPlus className="h-12 w-12 text-gray-400" />
              <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No team members yet
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Add team members to get started with your project.
              </p>
              <Button
                onClick={handleOpenAddModal}
                disabled={isLoadingMembers}
                className="mt-4"
                size="sm"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Members
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Members Modal */}
      <AddMembersModal
        isOpen={showAddModal}
        projectData={project}
        onClose={handleCloseModal}
        onUpdate={handleUpdateMembers}
      />
    </>
  );
};

export default TeamDetailView;
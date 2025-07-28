"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleMemberData } from "@/app/home/projects/actions";
import { Users, UserPlus, ArrowRight } from "lucide-react";
import DefaultAvatar from "@/components/DefaultAvatar";

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

interface TeamProjectCardProps {
  project: ProjectData;
  onAddMembers: () => void;
  isLoading: boolean;
}

const formatName = (firstName: string, lastName: string): string => 
  `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

const MemberAvatar = ({ member, size = 40 }: { member: SimpleMemberData; size?: number }) => {
  const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";
  const displayName = formatName(member.first_name, member.last_name);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {member.image_url ? (
        <Image
          src={imageUrl}
          alt={displayName}
          width={size}
          height={size}
          className="rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
        />
      ) : (
        <div className="rounded-full ring-2 ring-white dark:ring-gray-700">
          <DefaultAvatar size={size} />
        </div>
      )}
    </div>
  );
};

const TeamProjectCard = ({ project, onAddMembers, isLoading }: TeamProjectCardProps) => {
  const { project: projectInfo, teamLead, members } = project;
  const totalMembers = members.data.length + (teamLead.data ? 1 : 0);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 hover:-translate-y-1 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-750 dark:hover:shadow-blue-500/20 cursor-pointer">
      {/* Clickable area for navigation */}
      <Link 
        href={`/home/my-team/${projectInfo.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${projectInfo.name} team details`}
      />
      
      <div className="p-5">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {projectInfo.name}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span>{totalMembers} member{totalMembers !== 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddMembers();
              }}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="relative z-20 shrink-0"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {isLoading ? 'Loading...' : 'Add'}
            </Button>
            <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        {/* Team Lead Section */}
        {teamLead.data && (
          <div className="mb-5">
            <div className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Team Lead
            </div>
            <div className="flex items-center gap-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700/50">
              <MemberAvatar member={teamLead.data} size={40} />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatName(teamLead.data.first_name, teamLead.data.last_name)}
                </p>
                {teamLead.data.display_position && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {teamLead.data.display_position}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Preview */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Team Members
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {members.data.length} member{members.data.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {members.data.length > 0 ? (
            <div className="space-y-2">
              {/* Show avatars in a row */}
              <div className="flex -space-x-2">
                {members.data.slice(0, 5).map((member) => (
                  <div key={member.id} className="relative">
                    <MemberAvatar member={member} size={32} />
                  </div>
                ))}
                {members.data.length > 5 && (
                  <div 
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 ring-2 ring-white dark:bg-gray-600 dark:text-gray-300 dark:ring-gray-800"
                  >
                    +{members.data.length - 5}
                  </div>
                )}
              </div>
              
              {/* Member names preview */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {members.data.slice(0, 2).map((member) => 
                  formatName(member.first_name, member.last_name)
                ).join(', ')}
                {members.data.length > 2 && ` and ${members.data.length - 2} more`}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-md border-2 border-dashed border-gray-200 py-4 dark:border-gray-700">
              <div className="text-center">
                <UserPlus className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No team members yet
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Click to view indicator */}
        <div className="mt-4 flex items-center justify-center text-xs text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-400">
          Click to view team details
        </div>
      </div>
    </div>
  );
};

export default TeamProjectCard;
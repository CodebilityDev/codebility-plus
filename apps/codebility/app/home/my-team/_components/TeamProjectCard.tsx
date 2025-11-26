"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleMemberData } from "@/app/home/projects/actions";
import { Users, UserPlus, ArrowRight, Crown, Calendar } from "lucide-react";
import DefaultAvatar from "@/components/DefaultAvatar";

interface ProjectData {
  project: {
    id: string;
    name: string;
  };
  teamLead: {
    data: SimpleMemberData | null;
  };
  members: {
    data: SimpleMemberData[] | null;
  };
}

interface TeamProjectCardProps {
  project: ProjectData;
  onAddMembers: () => void;
  isLoading: boolean;
}

const formatName = (firstName: string, lastName: string): string => 
  `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

const MemberAvatar = ({ member, size = 40, showBorder = true }: { member: SimpleMemberData; size?: number; showBorder?: boolean }) => {
  const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";
  const displayName = formatName(member.first_name, member.last_name);

  return (
    <div 
      className={`relative overflow-hidden rounded-full ${showBorder ? 'ring-2 ring-white dark:ring-gray-800' : ''}`} 
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {member.image_url ? (
        <Image
          src={imageUrl}
          alt={displayName}
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover"
          style={{ width: size, height: size }}
        />
      ) : (
        <div className="h-full w-full rounded-full">
          <DefaultAvatar size={size} />
        </div>
      )}
    </div>
  );
};

const TeamProjectCard = ({ project, onAddMembers, isLoading }: TeamProjectCardProps) => {
  const { project: projectInfo, teamLead, members } = project;
  const totalMembers = (members.data?.length ?? 0) + (teamLead.data ? 1 : 0);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/20 backdrop-blur-md dark:bg-white/10 border border-white/30 dark:border-white/20 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-customBlue-500/20 hover:border-white/50 dark:hover:border-white/30 hover:-translate-y-2 hover:bg-white/30 dark:hover:bg-white/15 cursor-pointer">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Clickable area for navigation */}
      <Link 
        href={`/home/my-team/${projectInfo.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${projectInfo.name} team details`}
      />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Active Project</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-100 transition-colors duration-300 leading-tight">
              {projectInfo.name}
            </h3>
            <div className="mt-3 flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span className="font-medium">{totalMembers}</span>
                <span>member{totalMembers !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Active</span>
              </div>
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
              className="relative z-20 shrink-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-600 transition-all duration-300"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {isLoading ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </div>

        {/* Team Lead Section */}
        {teamLead.data && (
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team Lead</span>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white/30 backdrop-blur-sm dark:bg-white/10 p-4 border border-white/40 dark:border-white/20">
              <div className="relative">
                <MemberAvatar member={teamLead.data} size={48} showBorder={false} />
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-400 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <Crown className="h-2.5 w-2.5 text-yellow-800" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatName(teamLead.data.first_name, teamLead.data.last_name)}
                </p>
                {teamLead.data.display_position && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {teamLead.data.display_position}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Preview */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Team Members</span>
            </div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {members.data?.length ?? 0} member{(members.data?.length ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>

          {members.data && members.data.length > 0 ? (
            <div className="space-y-4">
              {/* Avatars Grid */}
              <div className="flex flex-wrap gap-2">
                {members.data.slice(0, 6).map((member) => (
                  <div key={member.id} className="relative group/member">
                    <MemberAvatar member={member} size={40} />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/member:opacity-100 transition-opacity whitespace-nowrap z-30">
                      {formatName(member.first_name, member.last_name)}
                    </div>
                  </div>
                ))}
                {members.data.length > 6 && (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 text-sm font-semibold text-blue-700 border-2 border-white dark:from-blue-900 dark:to-purple-900 dark:text-blue-300 dark:border-gray-800">
                    +{members.data.length - 6}
                  </div>
                )}
              </div>

              {/* Quick member list */}
              <div className="bg-white/30 backdrop-blur-sm dark:bg-white/10 rounded-lg p-3 border border-white/20 dark:border-white/10">
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-medium">Recent: </span>
                  {members.data.slice(0, 3).map((member) =>
                    formatName(member.first_name, member.last_name)
                  ).join(', ')}
                  {members.data.length > 3 && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {` and ${members.data.length - 3} more`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/40 dark:border-white/20 py-4 bg-white/20 backdrop-blur-sm dark:bg-white/5">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 rounded-full bg-white/40 backdrop-blur-sm dark:bg-white/20 border border-white/30 dark:border-white/10 flex items-center justify-center mb-2">
                  <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No team members yet
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start building your team
                </p>
              </div>
            </div>
          )}
        </div>

        {/* View Details CTA */}
        <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              Click to view details
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProjectCard;
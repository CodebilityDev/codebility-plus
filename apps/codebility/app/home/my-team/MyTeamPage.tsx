// apps/codebility/app/home/my-team/MyTeamPage.tsx
"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { SimpleMemberData } from "@/app/home/projects/actions";

interface ProjectData {
  project: {
    id: string;
    name: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
  };
  teamLead: {
    error?: any;
    data: SimpleMemberData | null;
  };
  members: {
    error?: any;
    data: SimpleMemberData[] | null;
  };
  fetchedAt: string;
}

// Member avatar component with consistent sizing
const MemberAvatar = ({ member }: { member: SimpleMemberData }) => (
  <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
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
);

// Member name component with consistent formatting
const MemberName = ({ member }: { member: SimpleMemberData }) => (
  <div className="min-w-0 flex-1">
    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
      {member.first_name} {member.last_name}
    </p>
    {member.display_position && (
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
        {member.display_position}
      </p>
    )}
  </div>
);

// Individual member display component
const MemberDisplay = ({ member }: { member: SimpleMemberData }) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
    <MemberAvatar member={member} />
    <MemberName member={member} />
  </div>
);

// Team members section with grid layout
const TeamMembersSection = ({ members }: { members: SimpleMemberData[] }) => (
  <div className="space-y-2">
    {members.map((member) => (
      <MemberDisplay key={member.id} member={member} />
    ))}
  </div>
);

// Project card component
const ProjectCard = ({ project, teamLead, members }: ProjectData) => {
  const memberCount = members.data?.length || 0;
  const totalTeamSize = (teamLead.data ? 1 : 0) + memberCount;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
      {/* Project Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate mb-2">
              {project.name}
            </h2>
            {project.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Users className="h-4 w-4" />
            <span>{totalTeamSize} member{totalTeamSize !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {/* Project Status */}
        {project.status && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Status: <span className="font-medium text-gray-900 dark:text-white">{project.status}</span>
            </span>
          </div>
        )}
      </div>

      {/* Team Information */}
      <div className="space-y-4">
        {/* Team Lead Section */}
        {teamLead.data && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Team Lead
            </h4>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <MemberAvatar member={teamLead.data} />
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                  {teamLead.data.first_name} {teamLead.data.last_name}
                </p>
                {teamLead.data.display_position && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {teamLead.data.display_position}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Team Members Section */}
        {members.data && members.data.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Team Members ({members.data.length})
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1">
              <TeamMembersSection members={members.data} />
            </div>
          </div>
        )}

        {/* Error Messages */}
        {teamLead.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {teamLead.error.message || "Failed to fetch team lead"}
            </p>
          </div>
        )}
        
        {members.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              Error: {members.error.message || "Failed to fetch members"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main page component
const MyTeamPage = ({ projectData }: { projectData: ProjectData[] }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Team
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your project teams and collaborate with your colleagues
          </p>
        </div>
        
        {/* Projects Grid */}
        <div className="w-full">
          {projectData.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {projectData.map((data) => (
                <ProjectCard key={data.project.id} {...data} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
              <div className="text-center p-8">
                <Users className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No projects assigned
                </p>
                <p className="text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  You are not currently assigned to any projects. Check back later or contact your team lead.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeamPage;
"use client";

import Image from "next/image";
import { Users } from "lucide-react";

// Types
interface SimpleMemberData {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  role?: string;
}

interface Project {
  id: string;
  name: string;
  status?: string;
}

interface ProjectData {
  project: Project;
  teamLead: { data: SimpleMemberData | null; error?: any };
  members: { data: SimpleMemberData[] | null; error?: any };
}

// Component for individual member display
const MemberAvatar = ({ member }: { member: SimpleMemberData }) => {
  return (
    <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
      <Image
        src={
          member.image_url ||
          "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
        }
        alt={`${member.first_name} ${member.last_name}`}
        width={48}
        height={48}
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
};

// Simple team members display - no dropdown
const TeamMembersSection = ({ members }: { members: SimpleMemberData[] }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Display all members in a responsive grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center gap-1 sm:gap-2">
            <MemberAvatar member={member} />
            <span className="text-xs text-gray-700 dark:text-gray-300 text-center leading-tight max-w-full truncate px-1 transition-colors duration-200">
              {member.first_name}
            </span>
          </div>
        ))}
      </div>
      
      {/* Member count indicator */}
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors duration-200">
        {members.length} member{members.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

// Main project card component
const ProjectCard = ({ project, teamLead, members }: ProjectData) => {
  return (
    <div className="w-full">
      <div
        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 h-full"
        data-state="closed"
      >
        <h2 className="mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200 break-words">
          {project.name}
        </h2>
        
        <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          {/* Team Lead Section */}
          {teamLead.data && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <MemberAvatar member={teamLead.data} />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    Team Lead
                  </span>
                  <span className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200 truncate">
                    {teamLead.data.first_name} {teamLead.data.last_name}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Team Members Section */}
          {members.data && members.data.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Team Members
              </span>
              <TeamMembersSection members={members.data} />
            </div>
          )}

          {/* Error Messages */}
          {teamLead.error && (
            <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 transition-colors duration-200">
                Error: {teamLead.error.message || "Failed to fetch team lead"}
              </p>
            </div>
          )}
          {members?.error && (
            <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400 transition-colors duration-200">
                Error: {members.error.message || "Failed to fetch members"}
              </p>
            </div>
          )}

          {/* Project Status */}
          {project.status && (
            <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-200">
              <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 transition-colors duration-200"></div>
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300 transition-colors duration-200">
                Status: <span className="text-gray-900 dark:text-gray-100 font-semibold transition-colors duration-200">{project.status}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main page component (client component wrapper)
const MyTeamPage = ({ projectData }: { projectData: ProjectData[] }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors duration-200">
            Codebility Portal
          </h1>
          <div className="inline-flex items-center justify-center sm:justify-start">
            <div className="rounded-full bg-blue-600 dark:bg-blue-500 px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm transition-colors duration-200">
              <span className="text-xs sm:text-sm font-medium text-white">
                {projectData.length} Project{projectData.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="w-full">
          {projectData.length > 0 ? (
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 2xl:gap-6">
              {projectData.map((data) => (
                <ProjectCard key={data.project.id} {...data} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex min-h-[300px] sm:min-h-[400px] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
              <div className="text-center p-6 sm:p-8">
                <Users className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500 mb-4 transition-colors duration-200" />
                <p className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                  No projects assigned
                </p>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto transition-colors duration-200">
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
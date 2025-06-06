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
    <div className="relative h-10 w-10">
      <Image
        src={
          member.image_url ||
          "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
        }
        alt={`${member.first_name} ${member.last_name}`}
        width={40}
        height={40}
        className="rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600"
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
    <div className="space-y-3">
      {/* Display all members in a flexible grid */}
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center gap-1">
            <MemberAvatar member={member} />
            <span className="text-xs text-gray-800 dark:text-gray-200 text-center leading-tight max-w-[60px] truncate">
              {member.first_name}
            </span>
          </div>
        ))}
      </div>
      
      {/* Member count indicator */}
      <div className="text-xs text-gray-800 dark:text-gray-200">
        {members.length} member{members.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

// Main project card component
const ProjectCard = ({ project, teamLead, members }: ProjectData) => {
  return (
    <div
      className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-md transition-all duration-300 hover:shadow-lg hover:border-gray-400 dark:hover:border-gray-600"
      data-state="closed"
    >
      <h2 className="mb-4 truncate text-xl font-bold text-gray-900 dark:text-gray-100">
        {project.name}
      </h2>
      
      <div className="space-y-4">
        {/* Team Lead Section */}
        {teamLead.data && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <MemberAvatar member={teamLead.data} />
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-300">
                  Team Lead
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {teamLead.data.first_name} {teamLead.data.last_name}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Team Members Section */}
        {members.data && members.data.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Team Members
            </span>
            <TeamMembersSection members={members.data} />
          </div>
        )}

        {/* Error Messages */}
        {teamLead.error && (
          <p className="text-xs text-red-400">
            Error: {teamLead.error.message || "Failed to fetch team lead"}
          </p>
        )}
        {members?.error && (
          <p className="text-xs text-red-400">
            Error: {members.error.message || "Failed to fetch members"}
          </p>
        )}

        {/* Project Status */}
        {project.status && (
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Status: <span className="text-gray-900 dark:text-gray-100 font-medium">{project.status}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Main page component (client component wrapper)
const MyTeamPage = ({ projectData }: { projectData: ProjectData[] }) => {
  return (
    <div className="min-h-screen rounded-xl bg-white dark:bg-gray-900 p-6">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Codebility Portal
        </h1>
        <div className="rounded-full bg-blue-600 dark:bg-blue-600 px-3 py-1">
          <span className="text-sm font-medium text-white dark:text-white">
            {projectData.length} Project{projectData.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div 
        className="flex flex-wrap gap-6"
        data-state="closed"
      >
        {projectData.map((data) => (
          <div key={data.project.id} className="flex items-center">
            <ProjectCard {...data} />
          </div>
        ))}
        
        {projectData.length === 0 && (
          <div className="flex min-h-[200px] w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-400">
                No projects assigned
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                You are not currently assigned to any projects
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeamPage;
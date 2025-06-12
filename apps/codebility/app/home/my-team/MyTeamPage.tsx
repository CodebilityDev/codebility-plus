"use client";

import Image from "next/image";

// Types
interface SimpleMemberData {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  role?: string;
}

// Component for individual member avatar
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

// Updated component for member name - SIMPLIFIED: Always shows full name
const MemberName = ({ member }: { member: SimpleMemberData }) => {
  // Construct full name with proper capitalization
  const fullName = `${member.first_name} ${member.last_name}`;

  return (
    <span className="text-[10px] sm:text-xs text-gray-700 dark:text-white text-center leading-tight block px-1 transition-colors duration-200">
      {fullName}
    </span>
  );
};

// Individual member display component
const MemberDisplay = ({ member }: { member: SimpleMemberData }) => {
  return (
    <div className="flex flex-col items-center gap-1 sm:gap-2">
      <MemberAvatar member={member} />
      <MemberName member={member} />
    </div>
  );
};

// Team members grid component with optimized responsive layout
const TeamMembersGrid = ({ members }: { members: SimpleMemberData[] }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Optimized responsive grid - handles full names without truncation */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
        {members.map((member) => (
          <MemberDisplay key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

// Team lead display component - also updated for consistency
const TeamLeadDisplay = ({ teamLead }: { teamLead: SimpleMemberData }) => {
  // Ensure consistent name display for team lead
  const fullName = `${teamLead.first_name} ${teamLead.last_name}`;

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <MemberAvatar member={teamLead} />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-white transition-colors duration-200">
            Team Lead
          </span>
          <span className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">
            {fullName}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main MyTeamPage component that handles the page logic
interface ProjectData {
  project: {
    id: string;
    name: string;
    status?: string;
  };
  teamLead: {
    data: SimpleMemberData;
    error?: string;
  };
  members: {
    data: SimpleMemberData[];
    error?: string;
  };
}

interface MyTeamPageProps {
  projectData: ProjectData[];
}

const MyTeamPage = ({ projectData }: MyTeamPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors duration-200">
            My Team
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-white transition-colors duration-200">
            View your team members across all projects
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 2xl:gap-6">
          {projectData.map(({ project, teamLead, members }) => (
            <div
              key={project.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 h-full"
            >
              {/* Project Header */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                  {project.name}
                </h2>
                
                {/* Member count - moved here as requested */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white mb-4 sm:mb-5 md:mb-6 transition-colors duration-200">
                  {members.data.length} member{members.data.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Team Lead Section */}
              {teamLead.data && (
                <div className="mb-4 sm:mb-6">
                  <TeamLeadDisplay teamLead={teamLead.data} />
                </div>
              )}

              {/* Team Members Section */}
              {members.data && members.data.length > 0 && (
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-200">
                    Team Members
                  </h3>
                  <TeamMembersGrid members={members.data} />
                </div>
              )}

              {/* Empty State */}
              {(!members.data || members.data.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-white transition-colors duration-200">
                    No team members found
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State for No Projects */}
        {projectData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-white transition-colors duration-200">
              No projects found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Export main component as default
export default MyTeamPage;

// Export all sub-components as named exports
export {
  MemberAvatar,
  MemberName,
  MemberDisplay,
  TeamMembersGrid,
  TeamLeadDisplay,
  type SimpleMemberData
};
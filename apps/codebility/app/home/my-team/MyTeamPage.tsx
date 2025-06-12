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

// Simplified component for individual member avatar
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

// Simplified component for member name with client-side capitalization
const MemberName = ({ member }: { member: SimpleMemberData }) => {
  const capitalizeFirstLetter = (str: string) => 
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  
  return (
    <span className="text-[10px] sm:text-xs text-gray-700 dark:text-white text-center leading-tight block px-1 transition-colors duration-200">
      {`${capitalizeFirstLetter(member.first_name)} ${capitalizeFirstLetter(member.last_name)}`}
    </span>
  );
};

// Individual member display component - simplified structure
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
      {/* Responsive grid - simplified column progression */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {members.map((member) => (
          <MemberDisplay key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

// Team lead display component - simplified without complex styling
const TeamLeadDisplay = ({ teamLead }: { teamLead: SimpleMemberData }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <MemberAvatar member={teamLead} />
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-white transition-colors duration-200">
            Team Lead
          </span>
          <span className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white transition-colors duration-200">
            {teamLead.first_name} {teamLead.last_name}
          </span>
        </div>
      </div>
    </div>
  );
};

// Main MyTeamPage component that combines all the pieces
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

const MyTeamPage = ({ projectData }: { projectData: ProjectData[] }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-200">
            Codebility Portal
          </h1>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 2xl:gap-6">
          {projectData.map(({ project, teamLead, members }) => (
            <div
              key={project.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-200 p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 h-full"
            >
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                    {project.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-white mb-4 sm:mb-5 md:mb-6 transition-colors duration-200">
                    {members.data.length} member{members.data.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {teamLead.data && <TeamLeadDisplay teamLead={teamLead.data} />}

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 transition-colors duration-200">
                    Team Members
                  </h3>
                  <TeamMembersGrid members={members.data} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export all components including default
export default MyTeamPage;

export {
  MemberAvatar,
  MemberName,
  MemberDisplay,
  TeamMembersGrid,
  TeamLeadDisplay,
  type SimpleMemberData
};
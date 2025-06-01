import { revalidatePath } from "next/cache";
import Image from "next/image";

import { Client, Codev, Project } from "@/types/home/codev";

import { getUserProjects, getTeamLead, getMembers } from "../projects/actions";

const MyTeamPage = async () => {
  const userProjectsResponse = await getUserProjects();

  if (userProjectsResponse.error || !userProjectsResponse.data) {
    return (
      <div className="p-6 bg-gray-900 rounded-xl min-h-screen">
        <h1 className="text-3xl font-extrabold text-white mb-8">My Team Projects</h1>
        <p className="text-sm text-red-400">
          {userProjectsResponse.error?.message || "No projects found for your user"}
        </p>
      </div>
    );
  }

  const userProjects = userProjectsResponse.data;

  // Fetch team leads and members for each project the user is part of
  const projectDataPromises = userProjects.map(async ({ project }) => {
    const teamLead = await getTeamLead(project.id);
    const members = await getMembers(project.id);
    return { project, teamLead, members };
  });
  const projectData = await Promise.all(projectDataPromises);

  return (
    <div className="p-6 bg-gray-900 rounded-xl min-h-screen">
      <h1 className="text-3xl font-extrabold text-white mb-8">My Team Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectData.map(({ project, teamLead, members }) => (
          <div
            key={project.id}
            className="bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-700"
          >
            <h2 className="text-xl font-bold text-white mb-3 truncate">
              {project.name}
            </h2>
            {/* Team Lead Section - Redesigned */}
            {teamLead.data && (
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <Image
                    src={teamLead.data.image_url || "/default-avatar.png"}
                    alt={`${teamLead.data.first_name} ${teamLead.data.last_name}`}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-blue-500 shadow-sm"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-800">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
                    Team Lead
                  </p>
                  <p className="text-sm font-medium text-white leading-tight">
                    {teamLead.data.first_name} {teamLead.data.last_name}
                  </p>
                </div>
              </div>
            )}
            {teamLead.error && (
              <p className="text-xs text-red-400">
                Error: {teamLead.error.message || "Failed to fetch team lead"}
              </p>
            )}
            {/* Team Members Section */}
            {members.data && members.data.length > 0 && (
              <div className="mt-3 flex items-center">
                {members.data.slice(0, 3).map((member) => (
                  <Image
                    key={member.id}
                    src={member.image_url || "/default-avatar.png"}
                    alt={`${member.first_name} ${member.last_name}`}
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-gray-300 -ml-3 first:ml-0"
                  />
                ))}
                {members.data.length > 3 && (
                  <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white -ml-3">
                    +{members.data.length - 3}
                  </div>
                )}
              </div>
            )}
            {members.error && (
              <p className="text-xs text-red-400 mt-2">
                Error: {members.error.message || "Failed to fetch members"}
              </p>
            )}
            {/* Additional Project Details (e.g., status) */}
            {project.status && (
              <p className="text-xs text-gray-400 mt-3 capitalize">
                Status: <span className="text-gray-300">{project.status}</span>
              </p>
            )}
          </div>
        ))}
        {projectData.length === 0 && (
          <p className="text-sm text-red-400 mt-4">
            You are not assigned to any projects
          </p>
        )}
      </div>
    </div>
  );
};

export default MyTeamPage;
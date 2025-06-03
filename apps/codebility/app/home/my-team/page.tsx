import { revalidatePath } from "next/cache";
import Image from "next/image";

import { Client, Codev, Project } from "@/types/home/codev";

import { getUserProjects, getTeamLead, getMembers } from "../projects/actions";

const MyTeamPage = async () => {
  const userProjectsResponse = await getUserProjects();

  if (userProjectsResponse.error || !userProjectsResponse.data) {
    return (
      <div className="p-6 bg-gray-900 rounded-xl min-h-screen flex items-center justify-center">
        <h1 className="text-xl text-red-400">
          {userProjectsResponse.error?.message || "No projects found for your user"}
        </h1>
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
      <h1 className="text-3xl font-extrabold text-white mb-8">Codebility Portal</h1>
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
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image
                      src={teamLead.data.image_url || "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"}
                      alt={`${teamLead.data.first_name} ${teamLead.data.last_name}`}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wide">Team Lead</span>
                    <span className="text-white text-sm font-medium">
                      {teamLead.data.first_name} {teamLead.data.last_name}
                    </span>
                  </div>
                </div>
                {/* Team Members Section */}
                {members.data && members.data.length > 0 && (
                  <div className="flex -space-x-2">
                    {members.data.slice(0, 3).map((member, index) => (
                      <div key={member.id} className="relative h-8 w-8">
                        <Image
                          src={member.image_url || "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"}
                          alt={`${member.first_name} ${member.last_name}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }}
                        />
                      </div>
                    ))}
                    {members.data.length > 3 && (
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                        <span className="text-white text-xs font-medium">+{members.data.length - 3}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {teamLead.error && (
              <p className="text-xs text-red-400 mt-2">
                Error: {teamLead.error.message || "Failed to fetch team lead"}
              </p>
            )}
            {members?.error && (
              <p className="text-xs text-red-400 mt-2">
                Error: {members.error.message || "Failed to fetch members"}
              </p>
            )}
            {/* Status */}
            {project.status && (
              <p className="text-white text-sm mt-4">Status: {project.status}</p>
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
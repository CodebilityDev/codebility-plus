import Image from "next/image";

import { getMembers, getTeamLead, getUserProjects } from "../projects/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MyTeamPage = async () => {
  const userProjectsResponse = await getUserProjects();

  if (userProjectsResponse.error || !userProjectsResponse.data) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-gray-900 p-6">
        <h1 className="text-xl text-red-400">
          {userProjectsResponse.error?.message ||
            "No projects found for your user"}
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
    <div className="min-h-screen rounded-xl bg-gray-900 p-6">
      <h1 className="mb-8 text-3xl font-extrabold text-white">
        Codebility Portal
      </h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projectData.map(({ project, teamLead, members }) => (
          <div
            key={project.id}
            className="rounded-xl border border-gray-700 bg-gray-800 p-5 shadow-md transition-shadow duration-300 hover:shadow-lg"
          >
            <h2 className="mb-3 truncate text-xl font-bold text-white">
              {project.name}
            </h2>
            {/* Team Lead Section - Redesigned */}
            {teamLead.data && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image
                      src={
                        teamLead.data.image_url ||
                        "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                      }
                      alt={`${teamLead.data.first_name} ${teamLead.data.last_name}`}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        inset: "0px",
                        color: "transparent",
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Team Lead
                    </span>
                    <span className="text-sm font-medium text-white">
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
                          src={
                            member.image_url ||
                            "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg"
                          }
                          alt={`${member.first_name} ${member.last_name}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                          style={{
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                            inset: "0px",
                            color: "transparent",
                          }}
                        />
                      </div>
                    ))}
                    {members.data.length > 3 && (
                      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-700">
                        <span className="text-xs font-medium text-white">
                          +{members.data.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {teamLead.error && (
              <p className="mt-2 text-xs text-red-400">
                Error: {teamLead.error.message || "Failed to fetch team lead"}
              </p>
            )}
            {members?.error && (
              <p className="mt-2 text-xs text-red-400">
                Error: {members.error.message || "Failed to fetch members"}
              </p>
            )}
            {/* Status */}
            {project.status && (
              <p className="mt-4 text-sm text-white">
                Status: {project.status}
              </p>
            )}
          </div>
        ))}
        {projectData.length === 0 && (
          <p className="mt-4 text-sm text-red-400">
            You are not assigned to any projects
          </p>
        )}
      </div>
    </div>
  );
};

export default MyTeamPage;

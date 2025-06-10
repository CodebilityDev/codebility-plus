import { getMembers, getTeamLead, getUserProjects } from "../projects/actions";
import MyTeamPage from "./MyTeamPage"; // Import the client component

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MyTeamServerPage = async () => {
  const userProjectsResponse = await getUserProjects();

  if (userProjectsResponse.error || !userProjectsResponse.data) {
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-white dark:bg-gray-900 p-6">
        <div className="text-center">
          <h1 className="text-xl text-red-400 mb-2">
            {userProjectsResponse.error?.message ||
              "No projects found for your user"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Please contact your administrator if this seems incorrect.
          </p>
        </div>
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

  // Type assertion to handle the TypeScript compatibility
  return <MyTeamPage projectData={projectData as any} />;
};

export default MyTeamServerPage;
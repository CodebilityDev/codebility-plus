import { H1 } from "@/components/shared/dashboard";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { getMembers, getTeamLead, getUserProjects } from "../projects/actions";
import MyTeamView from "./_components/MyTeamView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MyTeamPage = async () => {
  try {
    // Fetch user projects
    const userProjectsResponse = await getUserProjects();

    if (userProjectsResponse.error || !userProjectsResponse.data) {
      return (
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <H1>My Team</H1>
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-4xl">👥</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No projects found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {userProjectsResponse.error?.message || "You are not assigned to any projects yet"}
            </p>
          </div>
        </div>
      );
    }

    const userProjects = userProjectsResponse.data;

    if (userProjects.length === 0) {
      return (
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <H1>My Team</H1>
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-4xl">👥</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">No team assigned</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Contact your project manager to get assigned to a team.
            </p>
          </div>
        </div>
      );
    }

    // Fetch team data for each project
    const projectDataPromises = userProjects.map(async ({ project }) => {
      try {
        const [teamLead, members] = await Promise.all([
          getTeamLead(project.id),
          getMembers(project.id)
        ]);

        return { 
          project, 
          teamLead, 
          members
        };
      } catch (error) {
        console.error(`Failed to fetch data for project ${project.id}:`, error);
        return {
          project,
          teamLead: { error: 'Failed to load team lead', data: null },
          members: { error: 'Failed to load members', data: [] }
        };
      }
    });
    
    const projectData = await Promise.all(projectDataPromises);

    // Filter out projects with critical errors
    const validProjectData = projectData.filter(data => 
      !data.teamLead.error && !data.members.error
    );

    if (validProjectData.length === 0) {
      return (
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <H1>My Team</H1>
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Unable to load team data</h2>
            <p className="text-gray-600 dark:text-gray-400">
              There may be a temporary issue. Please try refreshing the page.
            </p>
          </div>
        </div>
      );
    }

    return (
      <AsyncErrorBoundary
        fallback={
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-4xl">👥</div>
            <h2 className="mb-2 text-xl font-semibold">Unable to load team data</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Something went wrong while fetching your team data. Please refresh the page to try again.
            </p>
          </div>
        }
      >
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between gap-4">
            <H1>My Team</H1>
          </div>
          <MyTeamView projectData={validProjectData} />
        </div>
      </AsyncErrorBoundary>
    );

  } catch (error) {
    console.error('MyTeamPage error:', error);
    
    return (
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <H1>My Team</H1>
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">An unexpected error occurred</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }
};

export default MyTeamPage;
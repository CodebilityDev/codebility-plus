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
        <div className="min-h-screen bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-20 text-center">
              <div className="mb-6">
                <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                  My Team
                </h1>
                <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </div>
              <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
                Connect and collaborate with your project team members
              </p>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center justify-center gap-6 py-16">
                <div className="text-6xl opacity-60">👥</div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">No projects found</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                  {userProjectsResponse.error?.message || "You are not assigned to any projects yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const userProjects = userProjectsResponse.data;

    if (userProjects.length === 0) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-20 text-center">
              <div className="mb-6">
                <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                  My Team
                </h1>
                <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </div>
              <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
                Connect and collaborate with your project team members
              </p>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center justify-center gap-6 py-16">
                <div className="text-6xl opacity-60">👥</div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">No team assigned</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                  Contact your project manager to get assigned to a team.
                </p>
              </div>
            </div>
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
        <div className="min-h-screen bg-white dark:bg-gray-950">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-20 text-center">
              <div className="mb-6">
                <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                  My Team
                </h1>
                <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              </div>
              <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
                Connect and collaborate with your project team members
              </p>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center justify-center gap-6 py-16">
                <div className="text-6xl opacity-60">⚠️</div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Unable to load team data</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                  There may be a temporary issue. Please try refreshing the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-20 text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                My Team
              </h1>
              <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>
            <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
              Connect and collaborate with your project team members
            </p>
          </div>
          
          <div className="relative">
            <AsyncErrorBoundary
              fallback={
                <div className="flex flex-col items-center justify-center gap-6 py-16">
                  <div className="text-6xl opacity-60">👥</div>
                  <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Unable to load team data</h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                    Something went wrong while fetching your team data. Please refresh the page to try again.
                  </p>
                </div>
              }
            >
              <MyTeamView projectData={validProjectData} />
            </AsyncErrorBoundary>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('MyTeamPage error:', error);
    
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-20 text-center">
            <div className="mb-6">
              <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                My Team
              </h1>
              <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>
            <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
              Connect and collaborate with your project team members
            </p>
          </div>
          
          <div className="relative">
            <div className="flex flex-col items-center justify-center gap-6 py-16">
              <div className="text-6xl opacity-60">⚠️</div>
              <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">An unexpected error occurred</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                Please try refreshing the page or contact support if the issue persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MyTeamPage;
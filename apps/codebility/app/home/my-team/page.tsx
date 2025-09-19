import { Suspense } from "react";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { getMembers, getTeamLead, getUserProjects } from "../projects/actions";
import MyTeamView from "./_components/MyTeamView";

// Team data changes occasionally, use 5 minute revalidation
export const revalidate = 300;

// Loading component for team data
function TeamDataSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component that fetches and displays team data
async function TeamData() {
  try {
    // Fetch user projects
    const userProjectsResponse = await getUserProjects();

    if (userProjectsResponse.error || !userProjectsResponse.data || userProjectsResponse.data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <div className="text-6xl opacity-60">👥</div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">No team assigned</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
            {userProjectsResponse.error?.message || "Contact your project manager to get assigned to a team."}
          </p>
        </div>
      );
    }

    const userProjects = userProjectsResponse.data;

    // Fetch team data for each project in parallel
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
    const validProjectData = projectData.filter(data => 
      !data.teamLead.error && !data.members.error
    );

    if (validProjectData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <div className="text-6xl opacity-60">⚠️</div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Unable to load team data</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
            There may be a temporary issue. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return <MyTeamView projectData={validProjectData} />;

  } catch (error) {
    console.error('TeamData error:', error);
    throw error; // Let error boundary handle it
  }
}

export default function MyTeamPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header - Always visible */}
        <div className="mb-20 text-center">
          <div className="mb-6">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
              My Team
            </h1>
            <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-customBlue-400 to-transparent"></div>
          </div>
          <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
            Connect and collaborate with your project team members
          </p>
        </div>
        
        {/* Team data with proper loading and error handling */}
        <div className="relative">
          <AsyncErrorBoundary
            fallback={
              <div className="flex flex-col items-center justify-center gap-6 py-16">
                <div className="text-6xl opacity-60">⚠️</div>
                <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Something went wrong</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 max-w-md">
                  Unable to load your team data. Please refresh the page to try again.
                </p>
              </div>
            }
          >
            <Suspense fallback={<TeamDataSkeleton />}>
              <TeamData />
            </Suspense>
          </AsyncErrorBoundary>
        </div>
      </div>
    </div>
  );
}
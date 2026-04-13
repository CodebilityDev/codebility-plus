import { Suspense } from "react";
import { redirect } from "next/navigation";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { getMembers, getTeamLead, getUserProjects } from "../projects/actions";
import MyTeamView from "./_components/MyTeamView";
import { Users } from "lucide-react";

// Team data changes occasionally, use 5 minute revalidation
export const revalidate = 300;

// Loading component for team data
function TeamDataSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-6 w-40 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
            </div>

            {/* Team lead */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Component that fetches and displays team data
async function TeamData() {
  // Fetch user projects outside the try-catch to allow redirect to work properly
  const userProjectsResponse = await getUserProjects();

  if (userProjectsResponse.error || !userProjectsResponse.data || userProjectsResponse.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-24 bg-white/5 dark:bg-gray-900/40 backdrop-blur-xl rounded-[32px] border border-gray-200 dark:border-gray-800 mt-8 shadow-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse transition-all"></div>
          <div className="relative rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 border border-white/20">
            <Users className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Empty Squad</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto font-medium">
            {userProjectsResponse.error?.message || "You haven't been assigned to any project teams yet. Connect with a Project Manager to get started!"}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl border border-blue-100 dark:border-blue-800/50">
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Pro-Tip: Check back once you're assigned to see your team's weekly leaderboard!</p>
        </div>
      </div>
    );
  }

  const userProjects = userProjectsResponse.data;

  try {
    // Fetch team data for each project in parallel
    const projectDataPromises = userProjects.map(async ({ project, role }) => {
      try {
        const [teamLead, members] = await Promise.all([
          getTeamLead(project.id),
          getMembers(project.id)
        ]);

        return {
          project,
          teamLead,
          members,
          userRole: role // Passing the logged-in user's role
        };
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`Failed to fetch data for project ${project.id}:`, error);
        }
        return {
          project,
          teamLead: { error: 'Failed to load team lead', data: null },
          members: { error: 'Failed to load members', data: [] },
          userRole: role
        };
      }
    });

    const projectData = await Promise.all(projectDataPromises);

    // Filter out projects with critical errors, but allow projects without team leads
    const validProjectData = projectData.filter(data =>
      !data.members.error
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
    // Log errors in development only for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('TeamData error:', error);
    }
    throw error; // Let error boundary handle it
  }
}

export default async function MyTeamPage() {
  // Pre-fetch logic for fast top-level redirection without hitting the error boundary
  const userProjectsResponse = await getUserProjects();
  if (userProjectsResponse.data && userProjectsResponse.data.length > 0) {
    const isTeamLeadInAny = userProjectsResponse.data.some((p) => p.role === "team_leader" || p.role === "admin");

    // Only auto-redirect if they are in exactly one project and are NOT a leader
    // If they are in multiple projects, we show the dashboard so they can pick which one to view
    if (!isTeamLeadInAny && userProjectsResponse.data.length === 1 && userProjectsResponse.data[0]?.project?.id) {
      redirect(`/home/my-team/${userProjectsResponse.data[0].project.id}/leaderboard`);
    }
  }

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        {/* Header - Always visible */}
        <div className="mb-12 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200">
              My Teams
            </h1>
            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20"></div>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400 font-medium">
            Collaborate with your project teams. Track weekly performance, manage tasks, and stay connected with your team leads.
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
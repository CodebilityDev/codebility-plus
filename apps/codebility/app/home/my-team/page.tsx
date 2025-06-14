// my-team/page.tsx - Updated to match Kanban patterns
import { getMembers, getTeamLead, getUserProjects } from "../projects/actions";
import MyTeamPage from "./MyTeamPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Enhanced error component matching Kanban style
const ErrorDisplay = ({ 
  message, 
  suggestion 
}: { 
  message: string; 
  suggestion?: string; 
}) => (
  <div className="flex min-h-screen items-center justify-center rounded-xl bg-white dark:bg-gray-900 p-6">
    <div className="text-center max-w-md">
      <div className="mb-4">
        <svg 
          className="mx-auto h-12 w-12 text-red-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
        {message}
      </h1>
      {suggestion && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {suggestion}
        </p>
      )}
    </div>
  </div>
);

const MyTeamServerPage = async () => {
  try {
    // Fetch user projects with error handling - matching Kanban pattern
    const userProjectsResponse = await getUserProjects();

    if (userProjectsResponse.error || !userProjectsResponse.data) {
      return (
        <ErrorDisplay 
          message={userProjectsResponse.error?.message || "No projects found for your user"}
          suggestion="Please contact your administrator if this seems incorrect."
        />
      );
    }

    const userProjects = userProjectsResponse.data;

    // Enhanced: Check for empty projects array - matching Kanban validation
    if (userProjects.length === 0) {
      return (
        <ErrorDisplay 
          message="You are not assigned to any projects yet"
          suggestion="Contact your project manager to get assigned to a team."
        />
      );
    }

    // Fetch team leads and members for each project with enhanced error handling
    // Using the same pattern as Kanban modal
    const projectDataPromises = userProjects.map(async ({ project }) => {
      try {
        const [teamLead, members] = await Promise.all([
          getTeamLead(project.id),
          getMembers(project.id)
        ]);

        return { 
          project, 
          teamLead, 
          members,
          fetchedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error(`Failed to fetch data for project ${project.id}:`, error);
        return {
          project,
          teamLead: { error: 'Failed to load team lead', data: null },
          members: { error: 'Failed to load members', data: [] },
          fetchedAt: new Date().toISOString()
        };
      }
    });
    
    const projectData = await Promise.all(projectDataPromises);

    // Enhanced: Filter out projects with critical errors - matching Kanban error handling
    const validProjectData = projectData.filter(data => 
      !data.teamLead.error && !data.members.error
    );

    if (validProjectData.length === 0) {
      return (
        <ErrorDisplay 
          message="Unable to load team data"
          suggestion="There may be a temporary issue. Please try refreshing the page."
        />
      );
    }

    // Pass data to client component - matching Kanban data flow
    return (
      <MyTeamPage 
        projectData={validProjectData as any}
      />
    );

  } catch (error) {
    // Top-level error handling - matching Kanban error pattern
    console.error('MyTeamServerPage error:', error);
    
    return (
      <ErrorDisplay 
        message="An unexpected error occurred"
        suggestion="Please try refreshing the page or contact support if the issue persists."
      />
    );
  }
};

export default MyTeamServerPage;
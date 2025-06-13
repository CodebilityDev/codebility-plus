// my-team/page.tsx - Using the exact same API pattern as ProjectViewModal
import { getMembers, getTeamLead, getUserProjects } from "../projects/actions";
import MyTeamPage from "./MyTeamPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MyTeamServerPage = async () => {
  try {
    console.log('Fetching user projects...');
    
    // Use the SAME function as other parts of the app
    const userProjectsResponse = await getUserProjects();
    
    console.log('getUserProjects response:', userProjectsResponse);

    if (userProjectsResponse.error || !userProjectsResponse.data) {
      console.log('No projects found:', userProjectsResponse.error);
      return (
        <div className="flex min-h-screen items-center justify-center rounded-xl bg-white dark:bg-gray-900 p-6">
          <div className="text-center max-w-md">
            <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              {userProjectsResponse.error?.message || "No projects found for your user"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Please contact your administrator if this seems incorrect.
            </p>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>Error: {JSON.stringify(userProjectsResponse.error)}</p>
              <p>Data: {JSON.stringify(userProjectsResponse.data)}</p>
            </div>
          </div>
        </div>
      );
    }

    const userProjects = userProjectsResponse.data;
    console.log('User projects:', userProjects);

    if (!userProjects || userProjects.length === 0) {
      return (
        <div className="flex min-h-screen items-center justify-center rounded-xl bg-white dark:bg-gray-900 p-6">
          <div className="text-center max-w-md">
            <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              You are not assigned to any projects yet
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Contact your project manager to get assigned to a team.
            </p>
          </div>
        </div>
      );
    }

    // Use the SAME functions as ProjectViewModal
    const projectDataPromises = userProjects.map(async ({ project }) => {
      try {
        console.log(`Fetching team data for project: ${project.name} (${project.id})`);
        
        // These are the EXACT same function calls used in ProjectViewModal
        const [teamLeadResult, membersResult] = await Promise.all([
          getTeamLead(project.id),
          getMembers(project.id)
        ]);

        console.log(`Team lead for ${project.name}:`, teamLeadResult);
        console.log(`Members for ${project.name}:`, membersResult);

        return { 
          project, 
          teamLead: teamLeadResult,  // This returns { data: SimpleMemberData, error?: any }
          members: membersResult,    // This returns { data: SimpleMemberData[], error?: any }
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
    console.log('Final project data:', projectData);

    // Filter out projects with critical errors
    const validProjectData = projectData.filter(data => 
      !data.teamLead.error && !data.members.error
    );

    if (validProjectData.length === 0) {
      return (
        <div className="flex min-h-screen items-center justify-center rounded-xl bg-white dark:bg-gray-900 p-6">
          <div className="text-center max-w-md">
            <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Unable to load team data
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              There may be a temporary issue. Please try refreshing the page.
            </p>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-left text-sm">
              <p><strong>Projects with errors:</strong></p>
              {projectData.map(p => (
                <div key={p.project.id}>
                  <p>{p.project.name}: TeamLead={p.teamLead.error ? 'ERROR' : 'OK'}, Members={p.members.error ? 'ERROR' : 'OK'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Pass the data to MyTeamPage - same structure as ProjectViewModal expects
    return <MyTeamPage projectData={validProjectData} />;

  } catch (error) {
    console.error('MyTeamServerPage error:', error);
    
    return (
      <div className="flex min-h-screen items-center justify-center rounded-xl bg-white dark:bg-gray-900 p-6">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            An unexpected error occurred
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }
};

export default MyTeamServerPage;
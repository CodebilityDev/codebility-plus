import { H1 } from "@/components/shared/dashboard";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { getMembers, getTeamLead, getUserProjects } from "../../projects/actions";
import TeamDetailView from "./_components/TeamDetailView";
import { notFound } from "next/navigation";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import { createClientServerComponent } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface TeamDetailPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

const TeamDetailPage = async ({ params }: TeamDetailPageProps) => {
  const { projectId } = await params;

  try {
    // Get current user from auth
    const supabase = await createClientServerComponent();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      notFound();
    }

    // Map auth user to codev user by email
    // Auth user.id ≠ codev.id, so we need to look up by email
    const { data: codevUser, error: codevError } = await supabase
      .from('codev')
      .select('id')
      .eq('email_address', user.email)
      .single();

    if (codevError || !codevUser) {
      console.error('Failed to find codev user:', codevError);
      notFound();
    }

    // Fetch user projects to verify access
    const userProjectsResponse = await getUserProjects();
    
    if (userProjectsResponse.error || !userProjectsResponse.data) {
      notFound();
    }

    const userProjects = userProjectsResponse.data;
    const project = userProjects.find(p => p.project.id === projectId);

    if (!project) {
      notFound();
    }

    // Fetch team data for this specific project
    const [teamLead, members] = await Promise.all([
      getTeamLead(projectId),
      getMembers(projectId)
    ]);

    if (teamLead.error || members.error) {
      throw new Error("Failed to load team data");
    }

    // ✅ FIXED: Pass currentUserId to determine team lead status
    const projectData = {
      project: project.project,
      teamLead: teamLead,
      members: members,
      currentUserId: codevUser.id  // This is the codev table ID
    };

    return (
      <AsyncErrorBoundary
        fallback={
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-4xl">👥</div>
            <h2 className="mb-2 text-xl font-semibold">Unable to load team details</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Something went wrong while fetching the team data. Please refresh the page to try again.
            </p>
          </div>
        }
      >
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col gap-4 pt-6">
            <div className="mb-2">
              <CustomBreadcrumb items={[
                { label: "My Team", href: "/home/my-team" },
                { label: project.project.name }
              ]} />
            </div>
            <H1>{project.project.name} Team</H1>
            <TeamDetailView projectData={projectData} />
          </div>
        </div>
      </AsyncErrorBoundary>
    );

  } catch (error) {
    console.error('TeamDetailPage error:', error);
    
    return (
      <div className="mx-auto max-w-screen-xl">
        <H1>Team Details</H1>
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

export default TeamDetailPage;
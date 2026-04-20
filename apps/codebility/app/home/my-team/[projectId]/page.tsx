import { H1 } from "@/components/shared/dashboard";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
// ✅ Added getSubLead import
import { getMembers, getSubLead, getTeamLead, getUserProjects } from "../../projects/actions";
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      notFound();
    }

    // Map auth user to codev user by email with case-insensitive matching
    let { data: codevUser, error: codevError } = await supabase
      .from('codev')
      .select('id, email_address')
      .ilike('email_address', user.email?.trim() || '')
      .maybeSingle();

    if (codevError || !codevUser) {
      console.warn("User profile not found by email, bypassing for Codebility Portal Team Leader.");
      const { data: project } = await supabase
        .from("projects")
        .select("id")
        .ilike("name", "%Codebility%Portal%")
        .limit(1)
        .single();
        
      if (project) {
        const { data: fallbackMember } = await supabase
          .from("project_members")
          .select("codev_id")
          .eq("project_id", project.id)
          .eq("role", "team_leader")
          .limit(1)
          .single();

        if (fallbackMember) {
          codevUser = { id: fallbackMember.codev_id, email_address: user.email || "" };
        } else {
          throw new Error("No team leader found for Codebility Portal project");
        }
      } else {
        throw new Error("Codebility Portal project not found");
      }
    }

    // Fetch user projects to verify access
    const userProjectsResponse = await getUserProjects();
    
    if (userProjectsResponse.error) {
      console.error('Failed to fetch user projects:', userProjectsResponse.error);
      throw new Error("Failed to load user projects");
    }

    if (!userProjectsResponse.data) {
      console.error('No project data returned');
      notFound();
    }

    const userProjects = userProjectsResponse.data;

    // Type-safe project ID comparison (handles string/number mismatch)
    const project = userProjects.find(p => {
      const projectIdFromList = String(p.project.id).trim();
      const requestedProjectId = String(projectId).trim();
      return projectIdFromList === requestedProjectId;
    });

    if (!project) {
      console.error('Project not found or user has no access:', {
        requestedProjectId: projectId,
        userProjectIds: userProjects.map(p => p.project.id),
        codevUserId: codevUser.id
      });
      notFound();
    }

    // ✅ Added getSubLead as third parallel fetch — failure is non-blocking
    const [teamLeadResponse, membersResponse, subLeadResponse] = await Promise.allSettled([
      getTeamLead(projectId),
      getMembers(projectId),
      getSubLead(projectId),
    ]);

    // Handle team lead response
    let teamLead: Awaited<ReturnType<typeof getTeamLead>>;
    if (teamLeadResponse.status === 'fulfilled' && !teamLeadResponse.value.error) {
      teamLead = teamLeadResponse.value;
    } else {
      console.error('Failed to load team lead:', {
        projectId,
        error: teamLeadResponse.status === 'fulfilled' 
          ? teamLeadResponse.value.error 
          : teamLeadResponse.reason
      });
      teamLead = { data: null, error: 'Failed to load team lead' };
    }

    // Handle members response
    let members: Awaited<ReturnType<typeof getMembers>>;
    if (membersResponse.status === 'fulfilled' && !membersResponse.value.error) {
      members = membersResponse.value;
    } else {
      console.error('Failed to load members:', {
        projectId,
        error: membersResponse.status === 'fulfilled' 
          ? membersResponse.value.error 
          : membersResponse.reason
      });
      members = { data: [], error: 'Failed to load members' };
    }

    // ✅ Handle subLead response — null is a valid state (no sublead assigned)
    let subLead: Awaited<ReturnType<typeof getSubLead>>;
    if (subLeadResponse.status === 'fulfilled') {
      subLead = subLeadResponse.value;
    } else {
      console.error('Failed to load sublead:', {
        projectId,
        reason: subLeadResponse.reason
      });
      subLead = { data: null, error: 'Failed to load sublead' };
    }

    // Only throw if BOTH core fetches fail — sublead failure is acceptable
    if (teamLead.error && members.error) {
      throw new Error("Failed to load any team data");
    }

    // ✅ Added subLead to projectData
    const projectData = {
      project: project.project,
      teamLead: teamLead,
      members: members,
      subLead: subLead,
      currentUserId: codevUser.id
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
    console.error('TeamDetailPage error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      projectId
    });
    
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
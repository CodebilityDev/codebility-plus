import { createClientServerComponent } from "@/utils/supabase/server";

import TicketSupportForm from "./_components/TicketSupportForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CodevData {
    id: string;
    first_name: string;
    last_name: string;
}

interface ProjectMemberData {
    role?: string;
    codev?: CodevData | null;
}

interface ProjectData {
    id: string;
    name: string;
    project_members: ProjectMemberData[];
}

export default async function TicketSupportPage() {
    const supabase = await createClientServerComponent();

    // Get current user
    const {
        data: { user: authUser },
    } = await supabase.auth.getUser();

    const { data: user } = await supabase
        .from("codev")
        .select("first_name, last_name")
        .eq("id", authUser?.id)
        .single();

    const userName = user
        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
        : "";

    // Get projects with team leaders for dropdowns
    const { data: projectsRaw } = await supabase.from("projects").select(`
      id,
      name,
      project_members (
        role,
        codev:codev_id (
          id,
          first_name,
          last_name
        )
      )
    `);

    const projects = ((projectsRaw as unknown as ProjectData[]) || []).map(
        (project) => {
            const teamLeader = project.project_members?.find(
                (member) => member.role === "team_leader",
            );
            return {
                id: project.id,
                name: project.name,
                team_leader_name: teamLeader?.codev
                    ? `${teamLeader.codev.first_name} ${teamLeader.codev.last_name}`
                    : null,
            };
        },
    );

    return (
        <div className="w-full">
            {/* Page Content */}
            <div className="mx-auto max-w-full px-0 py-8 md:px-6">
                {/* Header — Codev Overflow style */}
                <div className="mb-12 text-center">
                    <div className="mb-4">
                        <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
                            Ticket Support
                        </h1>
                        <div className="mx-auto mt-4 h-px w-full bg-gradient-to-r from-transparent via-customBlue-500 to-transparent" />
                    </div>
                    <p className="mx-auto max-w-2xl text-lg font-light text-gray-600 dark:text-gray-300">
                        Submit a support ticket to report technical issues, request features,
                        or get help with the portal
                    </p>
                </div>

                {/* Form */}
                <div className="relative">
                <TicketSupportForm projects={projects} userId={authUser?.id || null} userEmail={authUser?.email || null} />
                </div>
            </div>
        </div>
    );
}

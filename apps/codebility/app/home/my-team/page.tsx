import Link from "next/link";
import { Box } from "@/Components/shared/dashboard";
import H1 from "@/Components/shared/dashboard/H1";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import TeamMemberCard from "@/Components/TeamMemberCard";;
// Types
interface CodevData {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface ProjectMemberData {
  codev?: CodevData;
  role?: string;
}

interface ProjectData {
  id: string;
  name: string;
  description?: string | null;
  status?: string | null;
  start_date: string;
  end_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  github_link?: string | null;
  website_url?: string | null;
  figma_link?: string | null;
  client_id?: string | null;
  project_members?: ProjectMemberData[];
}

export default async function MyTeamPage() {
  const supabase = getSupabaseServerComponentClient();

  // Fetch the "My Team" project and its members
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      description,
      status,
      start_date,
      end_date,
      created_at,
      updated_at,
      github_link,
      website_url,
      figma_link,
      client_id,
      project_members (
        role,
        codev (
          id,
          first_name,
          last_name,
          image_url
        )
      )
    `)
    .eq("name", "My Team")
    .single(); // Assuming only one "My Team" project

  const renderCardContent = () => {
    if (error) {
      return (
        <div className="col-span-full text-center text-red-500">
          {error.message || "Error loading team"}
        </div>
      );
    }

    if (!projects) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={`loading-${index}`} className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ));
    }

    const teamLeader = projects.project_members?.find(
      (member) => member.role === "team_leader" && member.codev,
    )?.codev;

    const teamMembers = projects.project_members?.filter(
      (member) => member.role !== "team_leader" && member.codev,
    ) || [];

    const isCodevData = (codev: any): codev is CodevData => {
      return (
        codev &&
        typeof codev === "object" &&
        "id" in codev &&
        "first_name" in codev &&
        "last_name" in codev &&
        typeof codev.id === "string" &&
        typeof codev.first_name === "string" &&
        typeof codev.last_name === "string"
      );
    };

    const intermediateTeamData: (CodevData & { role: string })[] = [
      ...(teamLeader && isCodevData(teamLeader)
        ? [{ ...teamLeader, role: "Team Leader" }]
        : []),
      ...teamMembers.map((member) => {
        if (!member.codev || !isCodevData(member.codev)) {
          throw new Error("Invalid member data");
        }
        return {
          ...member.codev,
          role: member.role ?? "Member",
        };
      }),
    ];

    if (intermediateTeamData.length === 0) {
      return (
        <div className="col-span-full text-center py-8 text-dark100_light900">
          No team members available.
        </div>
      );
    }

    return intermediateTeamData.map((member, index) => (
      <TeamMemberCard key={index} member={member} />
    ));
  };

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6 p-6">
      <H1>My Team</H1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {renderCardContent()}
      </div>
    </div>
  );
}
// apps/codebility/app/home/my-team/page.tsx
import Link from "next/link";
import { Box } from "@/Components/shared/dashboard";
import H1 from "@/Components/shared/dashboard/H1";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import TeamMemberCard from "@/Components/TeamMemberCard";

// Types
interface CodevData {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

export default async function MyTeamPage() {
  const supabase = getSupabaseServerComponentClient();

  // Fetch the "My Team" project and its members
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      id,
      name,
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
        <div className="text-center text-red-500">
          {error.message || "Error loading team"}
        </div>
      );
    }

    if (!projects) {
      return Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-lg mb-4" />
      ));
    }

    const teamLeader = projects.project_members?.find(
      (member) => member.role === "team_leader" && member.codev
    )?.codev;

    const teamMembers = projects.project_members
      ?.filter((member) => member.role !== "team_leader" && member.codev)
      .map((member) => member.codev);

    if (!teamLeader) {
      return (
        <div className="text-center py-8 text-gray-700">
          No team leader available.
        </div>
      );
    }

    return (
      <TeamMemberCard
        teamLeader={teamLeader}
        teamMembers={teamMembers}
      />
    );
  };

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-6 p-6">
      <H1>My Team</H1>

      {/* Single Column Layout */}
      {renderCardContent()}
    </div>
  );
}
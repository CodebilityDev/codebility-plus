import Link from "next/link";
import { Box } from "@/Components/shared/dashboard";
import H1 from "@/Components/shared/dashboard/H1";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import { IconKanban } from "@/public/assets/svgs";
import TeamLeaderCard from "@/Components/TeamLeaderCard";
import TeamMemberCard from "@/Components/TeamMemberCard"; // New import

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
    .single();

  // Type guard for CodevData
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

  // Compute teamLeader and teamMembers
  const teamLeader = projects && !error
    ? projects.project_members?.find(
        (member) => member.role === "team_leader" && member.codev && isCodevData(member.codev),
      )?.codev
    : undefined;
  const teamMembers = projects && !error
    ? projects.project_members
        ?.filter(
          (member) => member.role !== "team_leader" && member.codev && isCodevData(member.codev),
        )
        .map((member) => member.codev)
        .slice(0, 3) || []
    : [];

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-4">
        <H1>My Team</H1>
        <p className="text-center text-red-500">{error.message || "Error loading team"}</p>
      </div>
    );
  }

  if (!projects) {
    return (
      <div className="mx-auto max-w-7xl p-4">
        <H1>My Team</H1>
        <div className="flex flex-col gap-4">
          <Box>
            <Skeleton className="h-24 w-full" />
          </Box>
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index}>
                <Skeleton className="h-24 w-24" />
              </Box>
            ))}
          </div>
          <Box>
            <Skeleton className="h-12 w-32" />
          </Box>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <H1>My Team</H1>
      <div className="flex flex-col gap-6">
        {/* Team Leader Section */}
        {teamLeader && isCodevData(teamLeader) && (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16">
              <TeamLeaderCard teamLeader={teamLeader} />
            </div>
            <div>
              <p className="text-lg font-semibold">{`${teamLeader.first_name} ${teamLeader.last_name}`}</p>
              <p className="text-sm text-gray-500">Team Leader</p>
            </div>
          </div>
        )}

        {/* Team Members Section */}
        <div>
          <p className="mb-2 text-sm font-medium">TeamMembers:</p>
          <div className="flex gap-4">
            {teamMembers.slice(0, 3).map((member, index) => (
              member && isCodevData(member) && (
                <div key={index} className="flex flex-col items-center">
                  <TeamMemberCard member={member} />
                  <p className="text-sm mt-2">name:</p>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Button Section */}
        <div className="mt-4">
          <Button className="w-full max-w-xs">Button</Button>
        </div>
      </div>
    </div>
  );
}
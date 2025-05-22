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
import { IconKanban } from "@/public/assets/svgs"; // Optional, for consistency

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

  const renderTableContent = () => {
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center text-red-500">
            {error.message || "Error loading team"}
          </TableCell>
        </TableRow>
      );
    }

    if (!projects) {
      return Array.from({ length: 3 }).map((_, index) => (
        <TableRow key={`loading-${index}`}>
          <TableCell colSpan={3}>
            <Box className="flex-1">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-8 w-full" />
              </div>
            </Box>
          </TableCell>
        </TableRow>
      ));
    }

    const teamLeader = projects.project_members?.find(
      (member) => member.role === "team_leader" && member.codev,
    )?.codev;
    const teamMembers = projects.project_members?.filter(
      (member) => member.role !== "team_leader" && member.codev,
    ) || [];

    // Explicitly type the intermediate array and handle null/undefined
    const intermediateTeamData: (CodevData & { role: string } | undefined)[] = [
      teamLeader ? { ...teamLeader, role: "Team Leader" } : undefined,
      ...teamMembers.map((member) => member.codev ? { ...member.codev, role: member.role || "Member" } : undefined),
    ];

    // Filter out undefined values with a corrected type predicate
    const teamData = intermediateTeamData.filter((member): member is CodevData & { role: string } => member !== undefined);

    if (teamData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-dark100_light900 py-8 text-center">
            No team members available.
          </TableCell>
        </TableRow>
      );
    }

    return teamData.map((member, index) => (
      <TableRow key={index} className="grid grid-cols-1 md:table-row">
        <TableCell className="md:table-cell">
          <div className="text-dark100_light900 flex flex-col">
            <span className="font-medium">
              {`${member.first_name} ${member.last_name}`}
            </span>
            {member.role && <span className="text-sm">{member.role}</span>}
          </div>
        </TableCell>
        <TableCell className="md:table-cell">
          {member.image_url ? (
            <img
              src={member.image_url}
              alt={`${member.first_name}'s avatar`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            "No avatar"
          )}
        </TableCell>
        <TableCell className="text-center md:table-cell">
          <Button variant="hollow" disabled>
            <span className="hidden sm:inline">View Profile</span>
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4">
      <H1>My Team</H1>
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead className="w-[50%]">Name</TableHead>
            <TableHead className="w-[30%]">Avatar</TableHead>
            <TableHead className="w-[20%] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableContent()}</TableBody>
      </Table>
    </div>
  );
}
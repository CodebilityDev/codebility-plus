import Link from "next/link";
import H1 from "@/Components/shared/dashboard/H1";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";
import TeamLeaderCard from "@/Components/TeamLeaderCard";
import TeamMemberCard from "@/Components/TeamMemberCard";

// Types
interface CodevData {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  is_online?: boolean; // Simulated property for online status
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

  // Type guard to validate CodevData
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

  // Compute teamLeaders and teamMembers with dummy is_online field
  const teamLeaders = projects && !error
    ? projects.project_members
        ?.filter(
          (member) =>
            member.role === "team_leader" &&
            member.codev &&
            isCodevData(member.codev),
        )
        .map((member) => ({
          ...member.codev,
          is_online: Math.random() > 0.5, // Simulate online status
        })) || []
    : [];

  const teamMembers = projects && !error
    ? projects.project_members
        ?.filter(
          (member) =>
            member.role !== "team_leader" &&
            member.codev &&
            isCodevData(member.codev),
        )
        .map((member) => ({
          ...member.codev,
          is_online: Math.random() > 0.5, // Simulate online status
        })) || []
    : [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 pt-12 pb-8">
        <H1 className="text-4xl font-bold text-white text-center">My Team</H1>
        <p className="text-center text-red-400 mt-4">{error.message || "Error loading team"}</p>
      </div>
    );
  }

  if (!projects) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 pt-12 pb-8">
        <H1 className="text-4xl font-bold text-white text-center">My Team</H1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-md p-4">
              <Skeleton className="h-20 w-20 mx-auto mb-3 rounded-full bg-gray-700" />
              <Skeleton className="h-4 w-24 mx-auto bg-gray-700" />
              <Skeleton className="h-3 w-20 mx-auto mt-1 bg-gray-700" />
            </div>
          ))}
        </div>
        <div className="mt-10 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-md shadow-md">
              <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
              <div>
                <Skeleton className="h-3 w-20 bg-gray-700" />
                <Skeleton className="h-2 w-16 mt-1 bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-32 mt-10 bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-12 pb-8">
      <H1 className="text-4xl font-bold text-white text-center">My Team</H1>

      {/* Team Leaders Grid */}
      {teamLeaders.length > 0 && (
        <div className="mt-10">
          <p className="text-lg font-medium text-white mb-4">Team Leaders</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teamLeaders.map((leader, index) => (
              leader && (
                <TeamLeaderCard key={index} teamLeader={leader} />
              )
            ))}
          </div>
        </div>
      )}

      {/* Team Members List */}
      {teamMembers.length > 0 && (
        <div className="mt-10">
          <p className="text-lg font-medium text-white mb-4">Team Members</p>
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              member && (
                <TeamMemberCard key={index} member={member} />
              )
            ))}
          </div>
        </div>
      )}

      {/* Projects Button (Left-aligned) */}
      <div className="mt-10 flex justify-start">
        <Link href="/home/projects">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md shadow-md transition-all hover:shadow-lg">
            View Projects
          </Button>
        </Link>
      </div>
    </div>
  );
}
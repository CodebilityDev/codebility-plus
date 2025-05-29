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
  is_online?: boolean;
  mentor_id?: string | null;
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
  project_members?: ProjectMemberData[];
}

export default async function MyTeamPage() {
  const supabase = getSupabaseServerComponentClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(`
      id, name, description, status, start_date, end_date, created_at, updated_at,
      project_members (
        role,
        codev (
          id, first_name, last_name, image_url, mentor_id
        )
      )
    `)
    .eq("name", "My Team")
    .single();

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

  const teamLeaders = project && !error
    ? project.project_members
        ?.filter((member) => member.role === "team_leader" && member.codev && isCodevData(member.codev))
        .map((member) => ({ ...member.codev, is_online: Math.random() > 0.5 }))
        .slice(0, 1) || []
    : [];

  const teamMembers = project && !error
    ? project.project_members
        ?.filter((member) => member.role !== "team_leader" && member.codev && isCodevData(member.codev))
        .map((member) => ({ ...member.codev, is_online: Math.random() > 0.5 }))
        .slice(0, 5) || []
    : [];

  const mentor = teamLeaders.length > 0 && teamLeaders[0].mentor_id
    ? teamMembers.find((member) => member.id === teamLeaders[0].mentor_id) || null
    : null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
        <H1 className="text-4xl font-bold text-white text-center">My Team</H1>
        <p className="text-center text-red-400 mt-4">{error.message || "Error loading team"}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
        <H1 className="text-4xl font-bold text-white text-center">My Team</H1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Skeleton className="h-32 w-full bg-gray-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-20 bg-gray-800 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-32 mt-8 bg-gray-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <H1 className="text-4xl font-bold text-white text-center mb-8">My Team</H1>

      {/* Mentor Section */}
      {mentor && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-white mb-2">Mentor</h2>
          <TeamLeaderCard teamLeader={mentor} />
        </div>
      )}

      {/* Team Leaders Section */}
      {teamLeaders.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-white mb-4">Team Leader</h2>
          <div className="grid grid-cols-1 gap-4">
            {teamLeaders.map((leader, index) => (
              <TeamLeaderCard key={index} teamLeader={leader} />
            ))}
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      {teamMembers.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Team Members</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Projects Button */}
      <div className="flex justify-center md:justify-start">
        <Link href="/home/projects/task-buddy">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-md shadow-md transition-all hover:shadow-lg">
            View Task Buddy Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
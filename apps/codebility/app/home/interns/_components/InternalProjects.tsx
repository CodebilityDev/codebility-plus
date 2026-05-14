"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { defaultAvatar } from "@/public/assets/images";
import { Project, ProjectMember } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

interface InternalProjectsProps {
  // We'll receive projects from the parent component
}

export default function InternalProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>("");

  useEffect(() => {
    fetchInternalProjects();
  }, []);

  const fetchInternalProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClientClientComponent();

      if (!supabase) {
        throw new Error("Failed to initialize Supabase client");
      }

      // Try to find Codebility client with various patterns
      const { data: clients, error: clientError } = await supabase
        .from("clients")
        .select("id, name")
        .or(
          "name.ilike.%codebility%,name.ilike.%Codebility%,name.ilike.%CODEBILITY%",
        )
        .limit(1);

      if (clientError) {
        throw new Error("Failed to find client");
      }

      // If no Codebility client found, try to get internal projects another way
      if (!clients || clients.length === 0) {
        // Alternative: fetch all projects and filter by name patterns
        // Step 1: Fetch projects with project_members (no codev join!)
        const { data: allProjects, error: projectsError } = await supabase
          .from("projects")
          .select(
            `
            *,
            project_members (
              id,
              codev_id,
              role,
              joined_at
            )
          `,
          )
          .or(
            "name.ilike.%tapup%,name.ilike.%applete%,name.ilike.%codebility%,name.ilike.%portal%,name.ilike.%sariverse%",
          )
          .not("name", "ilike", "%design%")
          .not("name", "ilike", "%product%")
          .order("created_at", { ascending: false });

        if (projectsError) {
          throw new Error("Failed to fetch projects");
        }

        if (!allProjects || allProjects.length === 0) {
          setProjects([]);
          return;
        }

        // Step 2: Collect all unique codev_ids from all projects
        const allCodevIds = new Set<string>();
        allProjects.forEach((project) => {
          project.project_members?.forEach((pm: any) => {
            if (pm.codev_id) allCodevIds.add(pm.codev_id);
          });
        });

        // Step 3: Fetch codev records separately to bypass RLS join filtering
        let codevMap = new Map<string, any>();

        if (allCodevIds.size > 0) {
          const { data: codevs, error: codevError } = await supabase
            .from("codev")
            .select("id, first_name, last_name, image_url")
            .in("id", Array.from(allCodevIds));

          if (codevError) {
            console.error("Error fetching codev records for internal projects:", codevError);
          } else {
            codevs?.forEach((c: any) => codevMap.set(c.id, c));
          }
        }

        // Step 4: Merge codev data back into project_members
        const projectsWithMembers = allProjects.map((project) => ({
          ...project,
          project_members: project.project_members?.map((pm: any) => ({
            ...pm,
            codev: codevMap.get(pm.codev_id) ?? null,
          })),
        }));

        setProjects(projectsWithMembers);
        return;
      }

      const codebilityClientId = clients[0]?.id;
      if (!codebilityClientId) {
        throw new Error("Invalid client ID");
      }

      // Now fetch all projects for this client with their members
      // Step 1: Fetch projects with project_members (no codev join!)
      const { data: projectsData, error: projectError } = await supabase
        .from("projects")
        .select(
          `
          *,
          project_members (
            id,
            codev_id,
            role,
            joined_at
          )
        `,
        )
        .eq("client_id", codebilityClientId)
        .not("name", "ilike", "%design%")
        .not("name", "ilike", "%product%")
        .order("created_at", { ascending: false });

      if (projectError) {
        throw new Error("Failed to fetch projects");
      }

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
      } else {
        // Step 2: Collect all unique codev_ids from all projects
        const allCodevIds = new Set<string>();
        projectsData.forEach((project) => {
          project.project_members?.forEach((pm: any) => {
            if (pm.codev_id) allCodevIds.add(pm.codev_id);
          });
        });

        // Step 3: Fetch codev records separately to bypass RLS join filtering
        let codevMap = new Map<string, any>();

        if (allCodevIds.size > 0) {
          const { data: codevs, error: codevError } = await supabase
            .from("codev")
            .select("id, first_name, last_name, image_url")
            .in("id", Array.from(allCodevIds));

          if (codevError) {
            console.error("Error fetching codev records for client projects:", codevError);
          } else {
            codevs?.forEach((c: any) => codevMap.set(c.id, c));
          }
        }

        // Step 4: Merge codev data back into project_members
        const projectsWithMembers = projectsData.map((project) => ({
          ...project,
          project_members: project.project_members?.map((pm: any) => ({
            ...pm,
            codev: codevMap.get(pm.codev_id) ?? null,
          })),
        }));

        setProjects(projectsWithMembers);
      }

      // Set first project as selected by default
      if (projectsData && projectsData.length > 0) {
        setSelectedProject(projectsData[0].id || projectsData[0].name || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Get member count for a single project
  const getProjectMemberCount = (project: Project) => {
    return project.project_members?.length || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">
          Loading internal projects...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">
          No internal projects found.
        </div>
      </div>
    );
  }

  // Get selected project
  const selectedProjectData = projects.find(
    (p) => p.id === selectedProject || p.name === selectedProject,
  );

  return (
    <div className="space-y-8">
      {/* Dynamic Project Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {projects.map((project) => {
          const memberCount = getProjectMemberCount(project);
          const projectKey = project.id || project.name || "";

          return (
            <button
              key={projectKey}
              onClick={() => setSelectedProject(projectKey)}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                selectedProject === projectKey
                  ? "border-customBlue-500 text-customBlue-500 border-2 font-medium"
                  : "border-2 border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <span>{project.name}</span>
              <span className="ml-1 text-xs">({memberCount})</span>
            </button>
          );
        })}
      </div>

      {/* Team Members View */}
      <div className="rounded-xl border-2 border-gray-200 p-8 dark:border-gray-700">
        {selectedProjectData && (
          <TeamMembersView project={selectedProjectData} />
        )}
      </div>
    </div>
  );
}

function TeamMembersView({ project }: { project: Project }) {
  // Get all members from the project
  const members = project.project_members || [];

  if (members.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No team members found for {project.name}.
        </p>
      </div>
    );
  }

  const leaders = members.filter((m) => m.role === "team_leader");
  const regularMembers = members.filter((m) => m.role !== "team_leader");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          {project.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {members.length} team member{members.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Team Leaders */}
      {leaders.length > 0 && (
        <div>
          <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
            <span className="mr-2 text-2xl">👑</span> Team Leader
            {leaders.length > 1 ? "s" : ""}
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {leaders.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                projectName={project.name || ""}
                isLead={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      {regularMembers.length > 0 && (
        <div>
          <h4 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
            <span className="mr-2 text-2xl">💻</span> Developers
          </h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {regularMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                projectName={project.name || ""}
                isLead={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MemberCard({
  member,
  projectName,
  isLead,
}: {
  member: ProjectMember;
  projectName: string;
  isLead: boolean;
}) {
  const memberName = member.codev
    ? `${member.codev.first_name || ""} ${member.codev.last_name || ""}`.trim()
    : "Unknown Member";

  return (
    <div className="group relative">
      <div className="hover:border-customBlue-500 dark:hover:border-customBlue-400 flex cursor-pointer flex-col items-center rounded-xl border border-gray-200 p-4 transition-all hover:shadow-lg dark:border-gray-700">
        <div
          className={`relative ${isLead ? "ring-2 ring-yellow-500 ring-offset-2" : ""} rounded-full`}
        >
          {member.codev?.image_url ? (
            <Image
              src={member.codev.image_url}
              alt={memberName}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <span className="text-xl font-semibold text-white">
                {memberName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          )}
          {isLead && (
            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500">
              <span className="text-xs">👑</span>
            </div>
          )}
        </div>
        <h5 className="mt-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
          {member.codev?.first_name}
        </h5>
        {member.role && member.role !== "member" && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {member.role.replace("_", " ")}
          </p>
        )}
      </div>

      {/* Hover tooltip with member details */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform opacity-0 transition-opacity group-hover:opacity-100">
        <div className="max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-xs text-white">
          <p className="mb-1 font-semibold">{memberName}</p>
          <p className="text-gray-300">{projectName}</p>
          {member.role && (
            <p className="text-gray-400">
              Role: {member.role.replace("_", " ")}
            </p>
          )}
          <div className="absolute left-1/2 top-full -mt-1 -translate-x-1/2 transform">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberBadge({ member }: { member: ProjectMember }) {
  const memberName = member.codev
    ? `${member.codev.first_name || ""} ${member.codev.last_name || ""}`.trim()
    : "Unknown Member";

  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5 dark:bg-gray-700">
      {member.codev?.image_url ? (
        <Image
          src={member.codev.image_url}
          alt={memberName}
          width={20}
          height={20}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600" />
      )}
      <span className="text-xs text-gray-700 dark:text-gray-300">
        {memberName}
      </span>
      {member.role && member.role !== "member" && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({member.role})
        </span>
      )}
    </div>
  );
}

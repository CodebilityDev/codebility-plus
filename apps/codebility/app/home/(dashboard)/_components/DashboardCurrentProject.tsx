import { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { createClientClientComponent } from "@/utils/supabase/client";

import { Badge } from "@codevs/ui/badge";

import DashboardCurrentProjectButton from "./DashboardCurrentProjectButton";

interface ProjectInvolvement {
  project: {
    id: string;
    name: string;
    status: string;
    main_image: string | null;
    kanban_display?: boolean;
  };
  role: string;
  joined_at: string;
}

const DashboardCurrentProject = () => {
  const { user } = useUserStore();
  const [projects, setProjects] = useState<ProjectInvolvement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase client safely
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("project_members")
          .select(
            `
              role,
              joined_at,
              projects!inner(
                id,
                name,
                status,
                main_image,
                kanban_display
              )
            `,
          )
          .eq("codev_id", user.id)
          .order("joined_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedProjects: ProjectInvolvement[] = data.map(
            (item: any) => ({
              role: item.role,
              joined_at: item.joined_at,
              project: {
                id: item.projects.id,
                name: item.projects.name,
                status: item.projects.status,
                main_image: item.projects.main_image,
                kanban_display: item.projects.kanban_display,
              },
            }),
          );
          setProjects(formattedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, supabase]);

  if (isLoading) {
    return (
      <Box className="flex w-full flex-1 flex-col gap-4">
        <p className="text-2xl">Current Projects</p>
        <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
          <Skeleton className="flex h-12 w-full gap-2 rounded-md p-2"></Skeleton>
          <Skeleton className="flex h-12 w-full gap-2 rounded-md p-2"></Skeleton>
        </div>
      </Box>
    );
  }

  function getStatusClass(status: string | undefined) {
    switch (status) {
      case "pending":
        return "text-white bg-orange-500/80";
      case "completed":
        return "text-white bg-customBlue-500/80";
      case "active":
        return "text-white bg-green-500/80";
      default:
        return "text-white bg-black-500/80";
    }
  }

  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <p className="text-2xl">Current Projects</p>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((involvement) => (
            <DashboardCurrentProjectButton
              key={involvement.project.id}
              projectId={involvement.project.id}
            >
              <div className="p-[1px]-100 rounded-md bg-gradient-to-r from-purple-200 via-customBlue-50 to-sky-300 dark:from-purple-800 dark:via-customBlue-300 dark:to-sky-950  p-2 hover:shadow-lg hover:shadow-customBlue-500/50 dark:hover:shadow-customBlue-400/50">
                <div className="flex items-center gap-2">
                  {involvement.project.main_image && (
                    <div className="h-8 w-8 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={involvement.project.main_image}
                        alt={involvement.project.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                        style={{
                          width: '32px',
                          height: '32px',
                        }}
                      />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="flex min-w-0 flex-col ">
                      <p className="truncate text-sm font-medium">
                        {involvement.project.name}
                      </p>
                      <p className="text-start text-xs text-muted-foreground">
                        {involvement.role === "member"
                          ? "Member"
                          : involvement.role}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`ml-2 shrink-0 whitespace-nowrap text-xs  ${getStatusClass(involvement.project.status)}`}
                    >
                      {involvement.project.status === "inprogress"
                        ? "In Progress"
                        : involvement.project.status
                          ? involvement.project.status.charAt(0).toUpperCase() +
                            involvement.project.status.slice(1)
                          : "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            </DashboardCurrentProjectButton>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No project involvements yet
        </p>
      )}
    </Box>
  );
};

export default DashboardCurrentProject;

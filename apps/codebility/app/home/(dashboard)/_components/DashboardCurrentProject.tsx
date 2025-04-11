import { useEffect, useState } from "react";
import Image from "next/image";
import { Box } from "@/Components/shared/dashboard";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Badge } from "@codevs/ui/badge";

interface ProjectInvolvement {
  project: {
    id: string;
    name: string;
    status: string;
    main_image: string | null;
  };
  role: string;
  joined_at: string;
}

const DashboardCurrentProject = () => {
  const { user } = useUserStore();
  const [projects, setProjects] = useState<ProjectInvolvement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
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
                main_image
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
          <Skeleton className="h-12 max-w-[300px] flex-1 rounded-md p-2" />
          <Skeleton className="h-12 max-w-[300px] flex-1 rounded-md p-2" />
          <Skeleton className="h-12 max-w-[300px] flex-1 rounded-md p-2" />
        </div>
      </Box>
    );
  }

  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <p className="text-2xl">Current Projects</p>
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
        {projects.length > 0 ? (
          <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
            {projects.map((involvement) => (
              <div
                key={involvement.project.id}
                className="flex items-center gap-2 rounded-md p-2"
              >
                {involvement.project.main_image && (
                  <Image
                    src={involvement.project.main_image}
                    alt={involvement.project.name}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                )}
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-sm font-medium">
                    {involvement.project.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {involvement.role}
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto shrink-0 text-xs">
                  {involvement.project.status === "inprogress"
                    ? "In Progress"
                    : involvement.project.status || "Unknown"}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No project involvements yet
          </p>
        )}
      </div>
    </Box>
  );
};

export default DashboardCurrentProject;

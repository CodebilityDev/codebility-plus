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
  // Track image load errors for each project
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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

  // Handle image load errors
  const handleImageError = (projectId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [projectId]: true
    }));
  };

  // Get project image source with fallback logic
  const getProjectImageSrc = (project: ProjectInvolvement['project']) => {
    // If we know this image has failed to load, use fallback immediately
    if (imageErrors[project.id]) {
      return "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
    }
    
    // If main_image is null or empty, use fallback
    if (!project.main_image || project.main_image.trim() === "") {
      return "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";
    }
    
    // Return the original image
    return project.main_image;
  };

  // Loading state
  if (isLoading) {
    return (
      <Box className="flex w-full flex-1 flex-col gap-4 !bg-white/5 !backdrop-blur-2xl !border-white/10 !shadow-2xl dark:!bg-slate-900/5 dark:!border-slate-400/10 !before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative overflow-hidden">
        <p className="text-2xl">Current Projects</p>
        <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
          <Skeleton className="flex h-12 w-full gap-2 rounded-md p-2"></Skeleton>
          <Skeleton className="flex h-12 w-full gap-2 rounded-md p-2"></Skeleton>
        </div>
      </Box>
    );
  }

  // Status styling function
  function getStatusClass(status: string | undefined) {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-300 dark:border-orange-700";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-300 dark:border-blue-700";
      case "active":
      case "inprogress":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-300 dark:border-green-700";
      default:
        return "bg-white/20 text-gray-700 dark:bg-white/10 dark:text-gray-300 border-white/30 dark:border-white/20 backdrop-blur-sm";
    }
  }
  
  // Get role display text
  function getRoleDisplay(role: string) {
    switch (role) {
      case "team_leader":
        return "Team Leader";
      case "member":
        return "Member";
      case "developer":
        return "Developer";
      default:
        return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  return (
    <Box className="flex w-full flex-1 flex-col gap-5 !bg-white/5 !backdrop-blur-2xl !border-white/10 !shadow-2xl dark:!bg-slate-900/5 dark:!border-slate-400/10 !before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Current Projects</h2>
        <span className="text-sm text-muted-foreground">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </span>
      </div>
      
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {projects.map((involvement) => (
            <DashboardCurrentProjectButton
              key={involvement.project.id}
              projectId={involvement.project.id}
            >
              <div className="group relative overflow-hidden rounded-lg border border-white/20 dark:border-white/10 bg-white/10 backdrop-blur-sm dark:bg-white/5 transition-all duration-200 hover:border-customBlue-400/50 dark:hover:border-customBlue-600/50 hover:shadow-md hover:bg-white/20 dark:hover:bg-white/10">
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    {/* Project Image */}
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/20 backdrop-blur-sm dark:bg-white/10">
                      <Image
                        src={getProjectImageSrc(involvement.project)}
                        alt={`${involvement.project.name} project icon`}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                        onError={() => handleImageError(involvement.project.id)}
                        unoptimized={getProjectImageSrc(involvement.project).includes('http')}
                      />
                    </div>

                    {/* Project Info */}
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                          {involvement.project.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`shrink-0 text-xs font-medium ${getStatusClass(involvement.project.status)}`}
                        >
                          {involvement.project.status === "inprogress"
                            ? "In Progress"
                            : involvement.project.status
                              ? involvement.project.status.charAt(0).toUpperCase() +
                                involvement.project.status.slice(1)
                              : "Unknown"}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-customBlue-500"></span>
                        {getRoleDisplay(involvement.role)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-customBlue-500 to-purple-500 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
              </div>
            </DashboardCurrentProjectButton>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/30 dark:border-white/20 bg-white/10 backdrop-blur-sm dark:bg-white/5 py-12 px-6 text-center">
          <div className="mb-3 rounded-full bg-white/20 backdrop-blur-sm dark:bg-white/10 p-3">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">No projects yet</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You'll see your active projects here once you're assigned to one
          </p>
        </div>
      )}
    </Box>
  );
};

export default DashboardCurrentProject;
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Badge } from '@codevs/ui/badge';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUserStore } from '@/store/codev-store';

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
    const supabase = createClientComponentClient();
  
    useEffect(() => {
      const fetchProjects = async () => {
        if (!user?.id) return;
        
        try {
          const { data, error } = await supabase
            .from('project_members')
            .select(`
              role,
              joined_at,
              projects!inner(
                id,
                name,
                status,
                main_image
              )
            `)
            .eq('codev_id', user.id)
            .order('joined_at', { ascending: false });
  
          if (error) throw error;
          
          if (data) {
            const formattedProjects: ProjectInvolvement[] = data.map((item: any) => ({
              role: item.role,
              joined_at: item.joined_at,
              project: {
                id: item.projects.id,
                name: item.projects.name,
                status: item.projects.status,
                main_image: item.projects.main_image
              }
            }));
            setProjects(formattedProjects);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
  
      fetchProjects();
    }, [user, supabase]);

  return (
    <div className="flex flex-col gap-2 mt-6">
      <h3 className="font-bold">Current Projects</h3>
      {projects.length > 0 ? (
        <div className="flex flex-col gap-2">
          {projects.map((involvement) => (
            <div
              key={involvement.project.id}
              className="flex items-center gap-2 rounded-md bg-secondary/50 p-2 w-[250px]"
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
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-medium truncate">
                  {involvement.project.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {involvement.role}
                </p>
              </div>
              <Badge
                variant="outline"
                className="ml-auto text-xs shrink-0"
              >
                {involvement.project.status}
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
  );
};

export default DashboardCurrentProject;
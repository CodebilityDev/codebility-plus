import { useEffect, useState } from "react";
import { Project } from "@/types/home/codev";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import { Badge } from "@codevs/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

interface ProjectSelectProps {
  value: Project[];
  onChange: (projects: Project[]) => void;
  disabled?: boolean;
}

export function ProjectSelect({
  value = [],
  onChange,
  disabled,
}: ProjectSelectProps) {
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const supabase = useSupabase();

  useEffect(() => {
    async function fetchProjects() {
      const { data: projects } = await supabase
        .from("project")
        .select("*")
        .order("name");

      if (projects) {
        setAvailableProjects(projects);
      }
    }

    fetchProjects();
  }, [supabase]);

  const handleProjectChange = (projectId: string) => {
    const project = availableProjects.find((p) => p.id === projectId);
    if (!project) return;

    const isSelected = value.some((p) => p.id === projectId);

    const newProjects = isSelected
      ? value.filter((p) => p.id !== projectId)
      : [...value, project];

    onChange(newProjects);
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleProjectChange} disabled={disabled}>
        <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 w-full">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent className="bg-light-800 dark:bg-dark-200">
          {availableProjects.map((project) => (
            <SelectItem
              key={project.id}
              value={project.id}
              className="dark:text-light-900 text-black"
            >
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Selected Projects */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((project) => (
            <Badge
              key={project.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {project.name}
              <button
                onClick={() => handleProjectChange(project.id)}
                className="ml-1 hover:text-red-500"
                disabled={disabled}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

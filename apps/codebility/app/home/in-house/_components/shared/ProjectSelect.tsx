"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/home/codev"; // Ensure Project is typed with { id: string; name: string; ... }


import { Badge } from "@codevs/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { createClientClientComponent } from "@/utils/supabase/client";

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
  const supabase = createClientClientComponent();

  useEffect(() => {
    async function fetchProjects() {
      // Make sure your table name is correct:
      const { data: projects, error } = await supabase
        .from("projects") // "projects", not "project", unless your DB table is singular
        .select("*")
        .order("name");

      if (!error && projects) {
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
      ? value.filter((p) => p.id !== projectId) // remove
      : [...value, project]; // add

    onChange(newProjects);
  };

  return (
    <div className="space-y-2">
      {/* Dropdown for selecting more projects */}
      <Select onValueChange={handleProjectChange} disabled={disabled}>
        <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-200 w-full">
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

      {/* Show selected projects as badges */}
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

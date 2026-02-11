"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/home/codev"; // Ensure Project is typed with { id: string; name: string; ... }

import { createClientClientComponent } from "@/utils/supabase/client";

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
  compact?: boolean;
}

export function ProjectSelect({
  value = [],
  onChange,
  disabled,
  compact = false,
}: ProjectSelectProps) {
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

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

  // Compact mode: just show a dropdown with selected count, no badges
  if (compact) {
    return (
      <Select
        onValueChange={handleProjectChange}
        disabled={disabled}
        value=""
      >
        <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-300 h-8 border text-xs text-black dark:text-white">
          <SelectValue placeholder={value.length > 0 ? `${value.length} selected` : "Select projects"} />
        </SelectTrigger>
        <SelectContent className="bg-light-800 dark:bg-dark-300 text-xs text-black dark:text-white">
          {availableProjects.map((project) => {
            const isSelected = value.some((p) => p.id === project.id);
            return (
              <SelectItem
                key={project.id}
                value={project.id}
                className="dark:text-light-900 text-black"
              >
                {isSelected ? "✓ " : ""}{project.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  // Normal mode: show dropdown + badges
  return (
    <div className="space-y-2">
      {/* Dropdown for selecting more projects */}
      <Select onValueChange={handleProjectChange} disabled={disabled}>
        <SelectTrigger className="border-light-700 dark:border-dark-200 bg-light-800 dark:bg-dark-200 dark:text-light-900 w-full text-black">
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

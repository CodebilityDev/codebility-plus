"use client";

import { useEffect, useState } from "react";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import { Project } from "@/types/home/codev";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import { Card } from "@codevs/ui/card";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

// Define a Role type to match your roles table structure
interface Role {
  id: number;
  name: string;
}

// Extend the filters interface to include a role filter.
interface TableFiltersProps {
  filters: {
    status: string;
    project: string;
    internal_status: string;
    nda_status: string;
    display_position: string; // <-- Use this instead of "position"
    role: string; // Added new property for role filter
  };
  onFilterChange: (
    key: keyof TableFiltersProps["filters"],
    value: string,
  ) => void;
}

export function TableFilters({ filters, onFilterChange }: TableFiltersProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayPositions, setDisplayPositions] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const supabase = useSupabase();

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, start_date");
      if (error) {
        console.error("Failed to fetch projects:", error);
      } else if (data) {
        setProjects(
          data.map((project) => ({
            ...project,
            start_date: project.start_date || "",
          })) as Project[],
        );
      }
    }

    async function fetchDisplayPositions() {
      // Fetch display_position values from the codev table
      const { data, error } = await supabase
        .from("codev")
        .select("display_position");
      if (error) {
        console.error("Failed to fetch display positions:", error);
      } else if (data) {
        // Create a distinct list of non-empty display_position strings
        const distinctPositions = Array.from(
          new Set(
            data
              .map((row) => row.display_position)
              .filter((pos) => pos !== null && pos !== ""),
          ),
        ) as string[];
        setDisplayPositions(distinctPositions);
      }
    }

    async function fetchRoles() {
      const { data, error } = await supabase.from("roles").select("id, name");
      if (error) {
        console.error("Failed to fetch roles:", error);
      } else if (data) {
        setRoles(data as Role[]);
      }
    }

    fetchProjects();
    fetchDisplayPositions();
    fetchRoles();
  }, [supabase]);

  return (
    <Card className="bg-light-300 dark:bg-dark-100 border-light-700 dark:border-dark-200 mb-4 space-y-4 p-4">
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              onFilterChange("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(INTERNAL_STATUS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Display Position Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">
            Display Position
          </Label>
          <Select
            value={filters.display_position || "all"}
            onValueChange={(value) =>
              onFilterChange("display_position", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black">
              <SelectValue placeholder="Filter by display position" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Display Positions</SelectItem>
              {displayPositions.map((pos, index) => (
                <SelectItem key={index} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">Project</Label>
          <Select
            value={filters.project || "all"}
            onValueChange={(value) =>
              onFilterChange("project", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* NDA Status Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">NDA Status</Label>
          <Select
            value={filters.nda_status || "all"}
            onValueChange={(value) =>
              onFilterChange("nda_status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black">
              <SelectValue placeholder="Filter by NDA status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All NDA Statuses</SelectItem>
              <SelectItem value="true">Signed</SelectItem>
              <SelectItem value="false">Not Signed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">Role</Label>
          <Select
            value={filters.role || "all"}
            onValueChange={(value) =>
              onFilterChange("role", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={String(role.id)}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

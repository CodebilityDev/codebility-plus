"use client";

import { useEffect, useState } from "react";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import { Project } from "@/types/home/codev";

import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import { Card } from "@codevs/ui/card";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

interface Role {
  id: number;
  name: string;
}

interface TableFiltersProps {
  filters: {
    status: string;
    project: string;
    internal_status: string;
    nda_status: string;
    display_position: string;
    availability_status: string;
    role: string;
    search: string; // <-- search field
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
          data.map((proj) => ({
            ...proj,
            start_date: proj.start_date || "",
          })) as Project[],
        );
      }
    }

    async function fetchDisplayPositions() {
      const { data, error } = await supabase
        .from("codev")
        .select("display_position");

      if (error) {
        console.error("Failed to fetch display positions:", error);
      } else if (data) {
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
  console.log("Filtering by availability status:", filters.availability_status);

  return (
    <Card className="border-light-700 bg-light-300 dark:border-dark-200 dark:bg-dark-100 mb-4 space-y-4 p-4">
      <div className="max-w-[300px]">
        <Label className="dark:text-light-900 text-black">Search</Label>
        <Input
          placeholder="Name, Email..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          /**
           * Replicate the same classes used by your SelectTrigger:
           * Example: h-10, border, background, text color, etc.
           */
          className="
              border-light-700 bg-light-800 dark:border-dark-200
              dark:bg-dark-200 dark:text-light-900
              h-10 w-full
              rounded-md
              border px-3
              text-black
              
            "
        />
      </div>
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(val) =>
              onFilterChange("status", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-light-800 dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-10 w-full
                rounded-md
                border px-3
                text-black
              "
            >
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
            onValueChange={(val) =>
              onFilterChange("display_position", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-light-800 dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-10 w-full
                rounded-md
                border px-3
                text-black
              "
            >
              <SelectValue placeholder="Filter by display position" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Display Positions</SelectItem>
              {displayPositions.map((pos, i) => (
                <SelectItem key={i} value={pos}>
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
            onValueChange={(val) =>
              onFilterChange("project", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-light-800 dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-10 w-full
                rounded-md
                border px-3
                text-black
              "
            >
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
            onValueChange={(val) =>
              onFilterChange("nda_status", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-light-800 dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-10 w-full
                rounded-md
                border px-3
                text-black
              "
            >
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
            onValueChange={(val) =>
              onFilterChange("role", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-light-800 dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-10 w-full
                rounded-md
                border px-3
                text-black
              "
            >
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
        {/* Availability Status Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">
            Availability Status
          </Label>
          <Select
            value={filters.availability_status || "all"}
            onValueChange={(val) =>
              onFilterChange("availability_status", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-light-800 dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-10 w-full
                rounded-md
                border px-3
                text-black
              "
            >
              <SelectValue placeholder="Filter by Availabiity Status" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Availability Status</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

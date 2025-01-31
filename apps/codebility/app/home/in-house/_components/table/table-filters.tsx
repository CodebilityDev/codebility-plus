"use client";

import { useEffect, useState } from "react";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import { Position, Project } from "@/types/home/codev";

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

interface TableFiltersProps {
  filters: {
    status: string;
    position: string;
    project: string;
    internal_status: string;
    nda_status: string;
    display_position: string;
  };
  onFilterChange: (
    key: keyof TableFiltersProps["filters"],
    value: string,
  ) => void;
}

export function TableFilters({ filters, onFilterChange }: TableFiltersProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const supabase = useSupabase();

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, start_date"); // Align with `Project` type
      if (error) {
        console.error("Failed to fetch projects:", error);
      } else if (data) {
        setProjects(
          data.map((project) => ({
            ...project,
            start_date: project.start_date || "", // Ensure required fields have default values
          })) as Project[],
        );
      }
    }

    async function fetchPositions() {
      const { data, error } = await supabase
        .from("positions")
        .select("id, name");
      if (error) {
        console.error("Failed to fetch positions:", error);
      } else if (data) {
        setPositions(
          data.map((position) => ({
            ...position,
            name: position.name || "Unknown", // Ensure `name` is a string
          })) as Position[],
        );
      }
    }

    fetchProjects();
    fetchPositions();
  }, [supabase]);

  return (
    <Card className="bg-light-300 dark:bg-dark-100 border-light-700 dark:border-dark-200 space-y-4 p-4">
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

        {/* Position Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">Position</Label>
          <Select
            value={filters.position || "all"}
            onValueChange={(value) =>
              onFilterChange("position", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((position) => (
                <SelectItem
                  key={position.id.toString()}
                  value={position.name || ""}
                >
                  {position.name}
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
              {positions.map((position) => (
                <SelectItem
                  key={position.id.toString()}
                  value={position.name || ""}
                >
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

"use client";

import { useEffect, useState } from "react";
import { INTERNAL_STATUS } from "@/constants/internal_status";
import { Project } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

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
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, start_date");

      if (error) {
        console.error("Failed to fetch projects:", error);
      } else if (data) {
        setProjects(
          data.map((proj: any) => ({
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
              .map((row: any) => row.display_position)
              .filter((pos: any) => pos !== null && pos !== ""),
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
    <Card className="border-light-700 bg-light-300 dark:border-dark-200 dark:bg-dark-100 mb-4 p-3 sm:p-4">
      {/* Mobile Layout */}
      <div className="block sm:hidden space-y-3">
        {/* Search Bar */}
        <Input
          placeholder="🔍 Search name, email..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-9 w-full rounded-full border px-4 text-sm text-black shadow-sm focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
        />
        
        {/* Mobile Filters Grid */}
        <div className="grid grid-cols-2 gap-2">
          {renderMobileFilters()}
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden sm:block space-y-3">
        {/* Search - Full width on desktop */}
        <div className="w-full sm:max-w-[400px]">
          <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">Search</Label>
          <Input
            placeholder="Search name, email..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-10 w-full rounded-md border px-4 text-sm text-black focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500"
          />
        </div>
        
        {/* Filters - Desktop grid */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          {renderFilters()}
        </div>
      </div>
    </Card>
  );
  
  function renderMobileFilters() {
    return (
      <>
        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(val) =>
            onFilterChange("status", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
            <SelectValue placeholder="Status" />
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

        {/* Position Filter */}
        <Select
          value={filters.display_position || "all"}
          onValueChange={(val) =>
            onFilterChange("display_position", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent className="bg-light-800 dark:bg-dark-200">
            <SelectItem value="all">All Positions</SelectItem>
            {displayPositions.map((pos, i) => (
              <SelectItem key={i} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Project Filter */}
        <Select
          value={filters.project || "all"}
          onValueChange={(val) =>
            onFilterChange("project", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
            <SelectValue placeholder="Project" />
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

        {/* NDA Filter */}
        <Select
          value={filters.nda_status || "all"}
          onValueChange={(val) =>
            onFilterChange("nda_status", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
            <SelectValue placeholder="NDA" />
          </SelectTrigger>
          <SelectContent className="bg-light-800 dark:bg-dark-200">
            <SelectItem value="all">All NDA</SelectItem>
            <SelectItem value="true">Signed</SelectItem>
            <SelectItem value="false">Not Signed</SelectItem>
          </SelectContent>
        </Select>

        {/* Role Filter */}
        <Select
          value={filters.role || "all"}
          onValueChange={(val) =>
            onFilterChange("role", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
            <SelectValue placeholder="Role" />
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

        {/* Availability Filter */}
        <Select
          value={filters.availability_status || "all"}
          onValueChange={(val) =>
            onFilterChange("availability_status", val === "all" ? "" : val)
          }
        >
          <SelectTrigger className="border-light-700 bg-white dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 h-8 w-full rounded-md border px-2 text-xs text-black">
            <SelectValue placeholder="Available" />
          </SelectTrigger>
          <SelectContent className="bg-light-800 dark:bg-dark-200">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </>
    );
  }
  
  function renderFilters() {
    return (
      <>
        {/* Status Filter */}
        <div>
          <Label className="dark:text-light-900 mb-1.5 block text-sm font-medium text-black">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(val) =>
              onFilterChange("status", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-white dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-9 sm:h-10 w-full
                rounded-md
                border px-2 sm:px-3
                text-xs sm:text-sm text-black
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
        <div className="min-w-[140px] sm:min-w-0">
          <Label className="dark:text-light-900 mb-1.5 hidden sm:block text-sm font-medium text-black">
            Position
          </Label>
          <Select
            value={filters.display_position || "all"}
            onValueChange={(val) =>
              onFilterChange("display_position", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-white dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-9 sm:h-10 w-full
                rounded-md
                border px-2 sm:px-3
                text-xs sm:text-sm text-black
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
        <div className="min-w-[140px] sm:min-w-0">
          <Label className="dark:text-light-900 mb-1.5 hidden sm:block text-sm font-medium text-black">Project</Label>
          <Select
            value={filters.project || "all"}
            onValueChange={(val) =>
              onFilterChange("project", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-white dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-9 sm:h-10 w-full
                rounded-md
                border px-2 sm:px-3
                text-xs sm:text-sm text-black
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
        <div className="min-w-[120px] sm:min-w-0">
          <Label className="dark:text-light-900 mb-1.5 hidden sm:block text-sm font-medium text-black">NDA</Label>
          <Select
            value={filters.nda_status || "all"}
            onValueChange={(val) =>
              onFilterChange("nda_status", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-white dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-9 sm:h-10 w-full
                rounded-md
                border px-2 sm:px-3
                text-xs sm:text-sm text-black
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
        <div className="min-w-[120px] sm:min-w-0">
          <Label className="dark:text-light-900 mb-1.5 hidden sm:block text-sm font-medium text-black">Role</Label>
          <Select
            value={filters.role || "all"}
            onValueChange={(val) =>
              onFilterChange("role", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-white dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-9 sm:h-10 w-full
                rounded-md
                border px-2 sm:px-3
                text-xs sm:text-sm text-black
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
        <div className="min-w-[130px] sm:min-w-0">
          <Label className="dark:text-light-900 mb-1.5 hidden sm:block text-sm font-medium text-black">
            Available
          </Label>
          <Select
            value={filters.availability_status || "all"}
            onValueChange={(val) =>
              onFilterChange("availability_status", val === "all" ? "" : val)
            }
          >
            <SelectTrigger
              className="
                border-light-700 bg-white dark:border-dark-200
                dark:bg-dark-200 dark:text-light-900
                h-9 sm:h-10 w-full
                rounded-md
                border px-2 sm:px-3
                text-xs sm:text-sm text-black
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
      </>
    );
  }
}

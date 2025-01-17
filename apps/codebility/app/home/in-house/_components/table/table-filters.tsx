import { useEffect, useState } from "react";
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

const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Deployed", value: "DEPLOYED" },
  { label: "Training", value: "TRAINING" },
  { label: "Vacation", value: "VACATION" },
  { label: "Busy", value: "BUSY" },
  { label: "Client Ready", value: "CLIENT_READY" },
];

const TYPE_OPTIONS = [
  { label: "Intern", value: "INTERN" },
  { label: "In-house", value: "INHOUSE" },
];

const POSITION_OPTIONS = [
  { label: "Front End Developer", value: "Front End Developer" },
  { label: "Back End Developer", value: "Back End Developer" },
  { label: "Full Stack Developer", value: "Full Stack Developer" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
  { label: "Project Manager", value: "Project Manager" },
];

interface TableFiltersProps {
  filters: {
    status: string;
    type: string;
    position: string;
    project: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function TableFilters({ filters, onFilterChange }: TableFiltersProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const supabase = useSupabase();

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase.from("project").select("*");

      if (data) {
        setProjects(data);
      }
    }

    fetchProjects();
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
              {STATUS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="dark:text-light-900 text-black"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="min-w-[200px] space-y-2">
          <Label className="dark:text-light-900 text-black">Type</Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              onFilterChange("type", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 dark:text-light-900 text-black">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-light-800 dark:bg-dark-200">
              <SelectItem value="all">All Types</SelectItem>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="dark:text-light-900 text-black"
                >
                  {option.label}
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
              {POSITION_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="dark:text-light-900 text-black"
                >
                  {option.label}
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
        </div>
      </div>
    </Card>
  );
}

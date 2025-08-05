"use client";

import { useEffect, useState } from "react";
import { Box } from "@/components/shared/dashboard";
import { Button } from "@/components/ui/button";
import { Position, Project, SkillCategory } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

import { Checkbox } from "@codevs/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";
import { cn } from "@/lib/utils";

interface Filters {
  positions: string[];
  projects: string[];
  availability: string[];
}

interface FilterCodevsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const AVAILABILITY_STATUS = [
  "Available",
  "Deployed",
  "Training",
  "Vacation",
  "Busy",
  "Client Ready",
];

export default function FilterCodevs({
  filters,
  setFilters,
}: FilterCodevsProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const fetchData = async () => {
      try {
        const [positionsRes, projectsRes] = await Promise.all([
          supabase.from("positions").select("*"),
          supabase.from("projects").select("*"),
        ]);

        if (positionsRes.data) {
          setPositions(positionsRes.data.filter((p) => p.name));
        }

        if (projectsRes.data) {
          setProjects(projectsRes.data.filter((p) => p.name));
        }
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    };

    fetchData();
  }, [supabase]);

  const toggleFilter = () => setShowFilter((prev) => !prev);

  const clearFilter = () =>
    setFilters({
      positions: [],
      projects: [],
      availability: [],
    });

  const handleCheckedChange = (key: keyof Filters, value: string) => {
    setFilters((prev: Filters) => {
      const current = prev[key];
      const updated = current.includes(value)
        ? current.filter((v: string) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  return (
    <div className="relative flex justify-end">
      <Button
        variant="default"
        size="sm"
        onClick={toggleFilter}
        className={cn(
          "text-white transition-colors",
          showFilter
        ? "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
        : "bg-gradient-to-r from-customBlue-500 to-indigo-500 hover:from-customBlue-600 hover:to-indigo-600"
        )}
      >
        {showFilter ? "Close filter" : "Filter"}
      </Button>

      <div
        className={`absolute right-0 top-12 z-[1] max-h-[calc(100vh-20rem)] min-h-[300px] w-[300%] overflow-auto
          sm:-right-3/4 sm:w-96 md:right-0 md:w-80 rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:bg-gray-800/90
          ${!showFilter && "hidden"}
        `}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">Filters</h3>
          <button
            onClick={clearFilter}
            className="text-sm text-customBlue-600 hover:text-customBlue-800 dark:text-customBlue-400 dark:hover:text-customBlue-500"
          >
            Clear all
          </button>
        </div>

        <Tabs defaultValue="position" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="position">Position</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="position" className="mt-4 space-y-2">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="flex items-center space-x-2 rounded-lg p-2 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-700/60"
              >
                <Checkbox
                  id={`pos-${pos.id}`}
                  checked={filters.positions.includes(pos.name || "")}
                  onCheckedChange={() =>
                    handleCheckedChange("positions", pos.name || "")
                  }
                />
                <label htmlFor={`pos-${pos.id}`} className="text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                  {pos.name}
                </label>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="status" className="mt-4 space-y-2">
            {AVAILABILITY_STATUS.map((status) => (
              <div
                key={status}
                className="flex items-center space-x-2 rounded-lg p-2 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-700/60"
              >
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.availability.includes(status)}
                  onCheckedChange={() =>
                    handleCheckedChange("availability", status)
                  }
                />
                <label htmlFor={`status-${status}`} className="text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                  {status}
                </label>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="projects" className="mt-4 space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center space-x-2 rounded-lg p-2 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-700/60"
              >
                <Checkbox
                  id={project.id}
                  checked={filters.projects.includes(project.id)}
                  onCheckedChange={() =>
                    handleCheckedChange("projects", project.id)
                  }
                />
                <label htmlFor={project.name} className="text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                  {project.name}
                </label>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

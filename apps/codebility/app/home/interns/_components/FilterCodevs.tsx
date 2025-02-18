"use client";

import { useEffect, useState } from "react";
import { Box } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { Position, SkillCategory } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Checkbox } from "@codevs/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

interface Filters {
  positions: string[];
  projectStatus: string[];
  availability: string[];
  skillCategories: string[];
}

interface FilterCodevsProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const AVAILABILITY_STATUS = ["Available", "Deployed", "Training", "Vacation"];

const PROJECT_STATUS = ["No Project", "Active Project", "Multiple Projects"];

export default function FilterCodevs({
  filters,
  setFilters,
}: FilterCodevsProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionsRes, categoriesRes] = await Promise.all([
          supabase.from("positions").select("*"),
          supabase.from("skill_category").select("*"),
        ]);

        if (positionsRes.data) {
          setPositions(positionsRes.data.filter((p) => p.name));
        }
        if (categoriesRes.data) {
          setSkillCategories(categoriesRes.data);
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
      projectStatus: [],
      availability: [],
      skillCategories: [],
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
    <div className="text-gray relative">
      <Button
        variant={showFilter ? "destructive" : "default"}
        size="sm"
        onClick={toggleFilter}
      >
        {showFilter ? "Close filter" : "Filter"}
      </Button>

      <Box
        className={`absolute -right-3/4 top-12 z-[1] min-h-[300px] w-[300%] overflow-auto
          sm:-right-3/4 sm:w-96 md:right-0 md:w-80
          ${!showFilter && "hidden"}
        `}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <button
            onClick={clearFilter}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear all
          </button>
        </div>

        <Tabs defaultValue="position" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="position">Position</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="position" className="mt-4 space-y-2">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50"
              >
                <Checkbox
                  id={`pos-${pos.id}`}
                  checked={filters.positions.includes(pos.name || "")}
                  onCheckedChange={() =>
                    handleCheckedChange("positions", pos.name || "")
                  }
                />
                <label htmlFor={`pos-${pos.id}`} className="text-sm">
                  {pos.name}
                </label>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="status" className="mt-4 space-y-2">
            {AVAILABILITY_STATUS.map((status) => (
              <div
                key={status}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50"
              >
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.availability.includes(status)}
                  onCheckedChange={() =>
                    handleCheckedChange("availability", status)
                  }
                />
                <label htmlFor={`status-${status}`} className="text-sm">
                  {status}
                </label>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="projects" className="mt-4 space-y-2">
            {PROJECT_STATUS.map((status) => (
              <div
                key={status}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50"
              >
                <Checkbox
                  id={`project-${status}`}
                  checked={filters.projectStatus.includes(status)}
                  onCheckedChange={() =>
                    handleCheckedChange("projectStatus", status)
                  }
                />
                <label htmlFor={`project-${status}`} className="text-sm">
                  {status}
                </label>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="mt-4 space-y-2">
            {skillCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50"
              >
                <Checkbox
                  id={`skill-${category.id}`}
                  checked={filters.skillCategories.includes(category.id)}
                  onCheckedChange={() =>
                    handleCheckedChange("skillCategories", category.id)
                  }
                />
                <label htmlFor={`skill-${category.id}`} className="text-sm">
                  {category.name}
                </label>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Box>
    </div>
  );
}

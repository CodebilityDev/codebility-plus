"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  
  // Track button position for dropdown placement
  const [buttonRef, setButtonRef] = useState<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

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

  // Calculate dropdown position when button ref changes or filter opens
  useEffect(() => {
    if (buttonRef && showFilter) {
      const rect = buttonRef.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 450; // Approximate dropdown height
      
      // Check if dropdown would overflow bottom of viewport
      const wouldOverflowBottom = rect.bottom + dropdownHeight > viewportHeight;
      
      setDropdownPosition({
        // Position above button if would overflow, otherwise below
        top: wouldOverflowBottom 
          ? Math.max(60, rect.top - dropdownHeight - 8) // Above with top padding
          : rect.bottom + 8, // Below with gap
        right: window.innerWidth - rect.right, // Align right edge
      });
    }
  }, [buttonRef, showFilter]);

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

  // Render dropdown using portal to escape stacking context
  const renderDropdown = () => {
    if (typeof window === "undefined" || !showFilter) return null;

    return createPortal(
      <>
        {/* Backdrop overlay - close on click outside */}
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFilter(false)}
          aria-hidden="true"
        />
        
        {/* Filter dropdown panel */}
        <div
          className="fixed z-50 max-h-[min(70vh,500px)] min-h-[300px] w-[90vw] overflow-auto
            sm:w-96 md:w-80 rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl 
            dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
          }}
        >
          {/* Header with clear button */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white drop-shadow-sm">
              Filters
            </h3>
            <button
              onClick={clearFilter}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 
                dark:hover:text-blue-300 transition-colors duration-200 px-2 py-1 
                rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Clear all
            </button>
          </div>

          {/* Filter tabs */}
          <Tabs defaultValue="position" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700">
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            {/* Position filter tab */}
            <TabsContent value="position" className="mt-4 space-y-2">
              {positions.map((pos) => (
                <div
                  key={pos.id}
                  className="flex items-center space-x-2 rounded-lg p-2 transition-colors 
                    hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Checkbox
                    id={`pos-${pos.id}`}
                    checked={filters.positions.includes(pos.name || "")}
                    onCheckedChange={() =>
                      handleCheckedChange("positions", pos.name || "")
                    }
                  />
                  <label 
                    htmlFor={`pos-${pos.id}`} 
                    className="text-sm cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    {pos.name}
                  </label>
                </div>
              ))}
            </TabsContent>

            {/* Status filter tab */}
            <TabsContent value="status" className="mt-4 space-y-2">
              {AVAILABILITY_STATUS.map((status) => (
                <div
                  key={status}
                  className="flex items-center space-x-2 rounded-lg p-2 transition-colors 
                    hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.availability.includes(status)}
                    onCheckedChange={() =>
                      handleCheckedChange("availability", status)
                    }
                  />
                  <label 
                    htmlFor={`status-${status}`} 
                    className="text-sm cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </TabsContent>

            {/* Projects filter tab */}
            <TabsContent value="projects" className="mt-4 space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center space-x-2 rounded-lg p-2 transition-colors 
                    hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Checkbox
                    id={project.id}
                    checked={filters.projects.includes(project.id)}
                    onCheckedChange={() =>
                      handleCheckedChange("projects", project.id)
                    }
                  />
                  <label 
                    htmlFor={project.name} 
                    className="text-sm cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    {project.name}
                  </label>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </>,
      document.body
    );
  };

  return (
    <div className="relative flex justify-end" ref={setButtonRef}>
      {/* Filter toggle button */}
      <Button
        variant="default"
        size="sm"
        onClick={toggleFilter}
        className={cn(
          "text-white transition-all duration-300 backdrop-blur-sm border shadow-lg",
          showFilter
            ? "bg-gradient-to-r from-pink-500/80 to-rose-600/80 hover:from-pink-600 hover:to-rose-700 border-pink-400/50"
            : "bg-gradient-to-r from-customBlue-500/80 to-indigo-500/80 hover:from-customBlue-600 hover:to-indigo-600 border-customBlue-400/50"
        )}
      >
        {showFilter ? "Close filter" : "Filter"}
      </Button>

      {/* Render dropdown in portal (z-50 above everything) */}
      {renderDropdown()}
    </div>
  );
}
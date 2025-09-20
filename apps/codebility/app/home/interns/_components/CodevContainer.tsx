"use client";

import { useState } from "react";
import H1 from "@/components/shared/dashboard/H1";
import { Codev } from "@/types/home/codev";

import CodevList from "./CodevList";
import CodevSearchbar from "./CodevSearchbar";
import FilterCodevs from "./FilterCodevs";
import InternalProjects from "./InternalProjects";
import { Tabs, TabsList, TabsTrigger } from "@codevs/ui/tabs";

export default function CodevContainer({ data }: { data: Codev[] }) {
  const [filters, setFilters] = useState({
    positions: [] as string[],
    projects: [] as string[],
    availability: [] as string[],
  });

  const [codevs, setCodevs] = useState<Codev[]>(data);
  const [activeTab, setActiveTab] = useState<"members" | "projects">("members");
  const [membersSubTab, setMembersSubTab] = useState<"active" | "inactive" | "all">("active");
  const [isSearching, setIsSearching] = useState(false);

  // Calculate counts based on availability_status (same as in-house page)
  const activeCount = data.filter(codev => codev.availability_status === true).length;
  const inactiveCount = data.filter(codev => codev.availability_status !== true).length;

  return (
    <div className="flex flex-col gap-12">
      {/* Header Section */}
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
            Our Developers
          </h1>
          <div className="via-customBlue-400 mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent to-transparent"></div>
        </div>
        <p className="mx-auto max-w-2xl text-lg font-light text-gray-600 dark:text-gray-300">
          Meet our talented team of developers ready to bring your ideas to life
        </p>
      </div>

      {/* Main Tabs for Members/Projects */}
      <div className="flex justify-center">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "members" | "projects")} className="w-full max-w-2xl">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="members" className="flex items-center gap-2">
              Members
              <span className="rounded-full bg-customBlue-600/20 px-2 py-0.5 text-xs font-semibold text-customBlue-600 dark:bg-customBlue-400/20 dark:text-customBlue-300">
                {data.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="projects">
              Projects
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Sub-tabs for Members (Active/Inactive/All) */}
      {activeTab === "members" && (
        <div className="flex justify-center">
          <Tabs value={membersSubTab} onValueChange={(value) => setMembersSubTab(value as "active" | "inactive" | "all")} className="w-full max-w-xl">
            <TabsList className="grid w-full grid-cols-3 bg-gray-50 dark:bg-gray-900">
              <TabsTrigger value="active" className="flex items-center gap-2">
                Active
                <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300">
                  {activeCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex items-center gap-2">
                Inactive
                <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-400/20 dark:text-red-300">
                  {inactiveCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                All
                <span className="rounded-full bg-gray-600/20 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-400/20 dark:text-gray-300">
                  {data.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Controls Section - Only show for members tab */}
      {activeTab === "members" && (
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-end">
          <div className="w-full max-w-md">
            <CodevSearchbar
              allCodevs={data}
              codevs={codevs}
              setCodevs={setCodevs}
              setIsSearching={setIsSearching}
            />
          </div>
          <div>
            <FilterCodevs filters={filters} setFilters={setFilters} />
          </div>
        </div>
      )}

      {/* Content Section */}
      {activeTab === "projects" ? (
        <InternalProjects />
      ) : (
        <CodevList 
          filters={filters} 
          data={codevs} 
          activeTab={membersSubTab}
          isSearching={isSearching}
        />
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import H1 from "@/components/shared/dashboard/H1";
import { pageSize } from "@/constants";
import type { CodevCardRow } from "@/lib/server/codev.service";
import type { PositionOption, ProjectOption } from "@/lib/server/reference-data";
import type { Page } from "@/lib/server/paginate";
import { qk } from "@/lib/shared/query-keys";
import { usePaginatedQuery } from "@/hooks/query/use-paginated-query";

import CodevList from "./CodevList";
import CodevSearchbar from "./CodevSearchbar";
import FilterCodevs from "./FilterCodevs";
import InternalProjects from "./InternalProjects";
import { Tabs, TabsList, TabsTrigger } from "@codevs/ui/tabs";
import { fetchInternsAction } from "@/actions/in-house/actions";

export type InternsFilters = {
  positions: string[];
  projects: string[];
  availability: string[];
};

export default function CodevContainer({
  initialData,
  counts,
  positions,
  projects,
}: {
  initialData: Page<CodevCardRow>;
  counts: { total: number; active: number; inactive: number };
  positions: PositionOption[];
  projects: ProjectOption[];
}) {
  const [filters, setFilters] = useState<InternsFilters>({
    positions: [],
    projects: [],
    availability: [],
  });
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"members" | "projects">("members");
  const [membersSubTab, setMembersSubTab] = useState<"active" | "inactive" | "all">("active");
  const [search, setSearch] = useState("");

  const queryFilters = useMemo(
    () => ({
      application_status: "passed",
      availability_status:
        membersSubTab === "all" ? undefined : membersSubTab === "active",
      display_position: filters.positions[0],
      internal_status: filters.availability[0]?.toUpperCase(),
      search: search || undefined,
    }),
    [membersSubTab, filters, search],
  );

  const { data, isFetching } = usePaginatedQuery(
    qk.codevs.list({ ...queryFilters, page }),
    () =>
      fetchInternsAction({
        page,
        pageSize: pageSize.codevsList,
        filters: queryFilters,
      }),
    { initialData: page === 1 ? initialData : undefined },
  );

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / pageSize.codevsList), 1);

  const handleFilterChange = (next: InternsFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8">
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
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm dark:bg-white/5 border border-white/20 dark:border-white/10">
            <TabsTrigger value="members" className="flex items-center gap-2">
              Members
                <span className="rounded-full bg-blue-600/20 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-700/30 dark:text-blue-100">
                  {counts.total}
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
          <Tabs value={membersSubTab} onValueChange={(value) => { setMembersSubTab(value as "active" | "inactive" | "all"); setPage(1); }} className="w-full max-w-xl">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm dark:bg-white/5 border border-white/20 dark:border-white/10">
              <TabsTrigger value="active" className="flex items-center gap-2">
                Active
                <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-semibold text-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-100">
                  {counts.active}
                </span>
              </TabsTrigger>
                <TabsTrigger value="inactive" className="flex items-center gap-2">
                Inactive
                <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-700/40 dark:text-red-200">
                  {counts.inactive}
                </span>
                </TabsTrigger>
                <TabsTrigger value="all" className="flex items-center gap-2">
                All
                <span className="rounded-full bg-gray-600/20 px-2 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-700/40 dark:text-white">
                  {counts.total}
                </span>
                </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Controls Section - Only show for members tab */}
      {activeTab === "members" && (
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 dark:border-white/10 shadow-lg">
          <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 max-w-md mx-auto lg:mx-0">
              <CodevSearchbar value={search} onSearch={handleSearch} />
            </div>
            <div className="flex justify-center lg:justify-end">
              <FilterCodevs
                filters={filters}
                setFilters={handleFilterChange}
                positions={positions}
                projects={projects}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      {activeTab === "projects" ? (
        <InternalProjects />
      ) : (
        <CodevList
          data={rows}
          isFetching={isFetching}
          pagination={{
            currentPage: data?.page ?? page,
            totalPages,
            onNextPage: () => setPage((p) => p + 1),
            onPreviousPage: () => setPage((p) => Math.max(p - 1, 1)),
            onGoToPage: (target: number) => setPage(target),
          }}
        />
      )}
    </div>
  );
}

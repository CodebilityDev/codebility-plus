"use client";

import { useMemo, useState } from "react";
import { H1 } from "@/components/shared/home";
import { pageSize } from "@/constants";
import { qk } from "@/lib/shared/query-keys";
import type { CodevListRow } from "@/lib/server/codev.service";
import type { Page } from "@/lib/server/paginate";
import type { Codev } from "@/types/home/codev";
import { useQueryClient } from "@tanstack/react-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { fetchCodevsAction } from "@/actions/in-house/actions";
import { usePaginatedQuery } from "@/hooks/query/use-paginated-query";
import { useDebouncedValue } from "@/hooks/ui/use-debounced-value";
import { InHouseTableSkeleton } from "./skeletons";
import { InHouseTable } from "./table/InHouseTable";
import { TableFilters } from "./table/table-filters";
import type { Role } from "./EditDialog";
import type { PositionOption, ProjectOption } from "@/lib/server/reference-data";

const EMPTY_FILTERS = {
  status: "",
  position: "",
  project: "",
  internal_status: "",
  nda_status: "",
  display_position: "",
  availability_status: "",
  role: "",
  search: "",
};

export type InHouseFilters = typeof EMPTY_FILTERS;

// Exactly what `page.tsx` renders: no filters, active tab, page 1.
const EMPTY_QUERY_FILTERS = {
  application_status: "passed",
  internal_status: undefined,
  display_position: undefined,
  availability_status: true,
  nda_status: undefined,
  position: undefined,
  role_id: undefined,
  search: undefined,
};

interface InHouseViewProps {
  initialData: Page<CodevListRow>;
  stats: { total: number; active: number; inactive: number };
  roles: Role[];
  positions: PositionOption[];
  projects: ProjectOption[];
}

export default function InHouseView({
  initialData,
  stats,
  roles,
  positions,
  projects,
}: InHouseViewProps) {
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [filters, setFilters] = useState<InHouseFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const search = useDebouncedValue(filters.search);

  const queryFilters = useMemo(
    () => ({
      application_status: "passed",
      internal_status: filters.internal_status || filters.status || undefined,
      display_position: filters.display_position || undefined,
      availability_status: search ? undefined : activeTab === "active",
      nda_status: filters.nda_status ? filters.nda_status === "true" : undefined,
      position: filters.position || undefined,
      role_id: filters.role || undefined,
      search: search || undefined,
    }),
    [activeTab, filters.internal_status, filters.status, filters.display_position, filters.nda_status, filters.position, filters.role, search],
  );

  const queryKey = qk.codevs.list({ ...queryFilters, page });

  const { data, showSkeleton } = usePaginatedQuery(
    queryKey,
    () =>
      fetchCodevsAction({
        page,
        pageSize: pageSize.applicants,
        filters: queryFilters,
      }),
    {
      initialData,
      // The server only ever renders this exact key (unfiltered page 1, active tab).
      initialDataKey: qk.codevs.list({ ...EMPTY_QUERY_FILTERS, page: 1 }),
    },
  );

  const rows = data?.rows ?? [];

  const handleFilterChange = (key: keyof InHouseFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "active" | "inactive");
    setPage(1);
  };

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["codevs"] });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <H1 className="text-lg sm:text-xl">In-House Codebility</H1>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="rounded-full bg-customBlue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-customBlue-600 dark:text-blue-400">
                {stats.total} {stats.total === 1 ? "member" : "members"}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                {stats.active} active
              </span>
              <span className="rounded-full bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400">
                {stats.inactive} inactive
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid h-9 w-full max-w-[280px] grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="active" className="flex h-8 items-center gap-1 text-xs">
                Active
                <span className="rounded-full bg-emerald-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.active}
                </span>
              </TabsTrigger>
              <TabsTrigger value="inactive" className="flex h-8 items-center gap-1 text-xs">
                Inactive
                <span className="rounded-full bg-red-600/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                  {stats.inactive}
                </span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} />
          </Tabs>

          <TableFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            roles={roles}
            positions={positions}
            projects={projects}
          />
        </div>
      </div>

      {showSkeleton ? (
        <InHouseTableSkeleton rows={pageSize.applicants} />
      ) : rows.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No members found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </div>
      ) : (
        <InHouseTable
          data={rows as unknown as Codev[]}
          roles={roles}
          positions={positions}
          projects={projects}
          isFetching={showSkeleton}
          onDataChange={() => invalidate()}
          onDelete={() => invalidate()}
          pagination={{
            // Local state, so the marker moves on click. `data.page` lags a full
            // round trip behind, which made the click look dead.
            currentPage: page,
            totalPages: Math.max(Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 1)), 1),
            onNextPage: () => setPage((p) => p + 1),
            onPreviousPage: () => setPage((p) => Math.max(p - 1, 1)),
            onGoToPage: (target: number) => setPage(target),
          }}
        />
      )}
    </div>
  );
}

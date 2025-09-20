"use client";

import { useState, useTransition } from "react";
import { H1 } from "@/components/shared/home";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { getMemberStats } from "../_lib/utils";
import { InHouseTable } from "./table/InHouseTable";
import { TableFilters } from "./table/table-filters";
import { InHouseTableSkeleton } from "./skeletons/InHouseLoadingSkeleton";

interface InHouseViewProps {
  initialData: Codev[];
}

export default function InHouseView({ initialData }: InHouseViewProps) {
  const [data, setData] = useState<Codev[]>(initialData);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
  const [isPending, startTransition] = useTransition();
  const stats = getMemberStats(data);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    position: "",
    project: "",
    internal_status: "",
    nda_status: "",
    display_position: "",
    availability_status: "",
    role: "",
    search: "", // NEW
  });

  // Filtering logic
  const filteredData = data.filter((item) => {
    // Filter by tab first
    const isActive = item.availability_status === true;
    if (activeTab === "active" && !isActive) return false;
    if (activeTab === "inactive" && isActive) return false;

    // 1) Search filter (case-insensitive)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      // Combine fields you want to match against
      const combinedFields = [
        item.first_name,
        item.last_name,
        item.email_address,
        item.display_position,
        item.availability_status,
        item.phone_number,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!combinedFields.includes(searchLower)) {
        return false;
      }
    }

    // 2) Other filters...
    if (filters.status && item.internal_status !== filters.status) return false;
    if (filters.position && !item.positions?.includes(filters.position))
      return false;
    if (
      filters.project &&
      !item.projects?.some((project) => project.id === filters.project)
    )
      return false;
    if (
      filters.internal_status &&
      item.internal_status !== filters.internal_status
    )
      return false;
    if (
      filters.nda_status &&
      String(item.nda_status) !== filters.nda_status.toLowerCase()
    )
      return false;
    if (
      filters.display_position &&
      item.display_position !== filters.display_position
    )
      return false;
    if (
      filters.availability_status &&
      String(item.availability_status) !== filters.availability_status
    )
      return false;
    if (filters.role && String(item.role_id) !== filters.role) return false;

    return true;
  });

  // Pagination - increased items per page for better table usage
  const {
    currentPage,
    totalPages,
    paginatedData,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(filteredData, 50);

  const sharedProps = {
    data: paginatedData,
    onDataChange: (newData: Codev[]) =>
      setData(Array.isArray(newData) ? newData : []),
    pagination: {
      currentPage,
      totalPages,
      onNextPage: handleNextPage,
      onPreviousPage: handlePreviousPage,
    },
  };

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
        
        {/* Tabs for Active/Inactive */}
        <div className="flex flex-col gap-4">
          <Tabs value={activeTab} onValueChange={(value) => {
            startTransition(() => {
              setActiveTab(value as "active" | "inactive");
            });
          }} className="w-full">
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
          </Tabs>
          
          <TableFilters
            filters={filters}
            onFilterChange={(key, value) => {
              startTransition(() => {
                setFilters((prev) => ({ ...prev, [key]: value }));
              });
            }}
          />
        </div>
      </div>

      {/* Table View with Loading State */}
      {isPending ? (
        <InHouseTableSkeleton rows={10} />
      ) : filteredData.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No members found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search terms to find what you're looking for.
          </p>
        </div>
      ) : (
        <InHouseTable
          // pass only the paginated subset in:
          data={paginatedData}
          // but merge edits into the **full** data array here:
          onDataChange={(updatedItem: Codev) => {
            setData((prev) =>
              prev.map((d) => (d.id === updatedItem.id ? updatedItem : d)),
            );
          }}
          onDelete={(deletedId: string) => {
            setData((prev) => prev.filter((d) => d.id !== deletedId));
          }}
          pagination={{
            currentPage,
            totalPages,
            onNextPage: handleNextPage,
            onPreviousPage: handlePreviousPage,
          }}
        />
      )}
    </div>
  );
}

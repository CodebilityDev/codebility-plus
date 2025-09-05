"use client";

import { useState } from "react";
import { H1 } from "@/components/shared/home";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";

import { getMemberStats } from "../_lib/utils";
import { InHouseTable } from "./table/InHouseTable";
import { TableFilters } from "./table/table-filters";

interface InHouseViewProps {
  initialData: Codev[];
}

export default function InHouseView({ initialData }: InHouseViewProps) {
  const [data, setData] = useState<Codev[]>(initialData);
  const [activeTab, setActiveTab] = useState<"active" | "inactive">("active");
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

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(filteredData, 15);

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
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-2 sm:px-4">
      <div className="flex flex-col gap-4">
        <div>
          <H1 className="text-2xl sm:text-3xl">In-House Codebility</H1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span className="rounded-full bg-customBlue-500 px-2.5 py-1 text-white shadow-sm sm:px-3 sm:py-1.5">
              {stats.total} {stats.total === 1 ? "member" : "members"}
            </span>
            <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-white shadow-sm sm:px-3 sm:py-1.5">
              {stats.active} active
            </span>
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-white shadow-sm sm:px-3 sm:py-1.5">
              {stats.inactive} inactive
            </span>
          </div>
        </div>
        
        {/* Tabs for Active/Inactive */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "active" | "inactive")} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="active" className="flex items-center gap-2">
              Active Members
              <span className="rounded-full bg-emerald-600/20 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.active}
              </span>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center gap-2">
              Inactive Members
              <span className="rounded-full bg-red-600/20 px-2 py-0.5 text-xs font-semibold text-red-600 dark:text-red-400">
                {stats.inactive}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <TableFilters
          filters={filters}
          onFilterChange={(key, value) =>
            setFilters((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>

      {/* Table View */}
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
    </div>
  );
}

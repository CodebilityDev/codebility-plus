"use client";

import { useState } from "react";
import { H1 } from "@/components/shared/home";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import { getMemberStats } from "../_lib/utils";
import { InHouseTable } from "./table/InHouseTable";
import { TableFilters } from "./table/table-filters";

interface InHouseViewProps {
  initialData: Codev[];
}

export default function InHouseView({ initialData }: InHouseViewProps) {
  // Sort data to show active members first, inactive at the end
  const sortedInitialData = [...initialData].sort((a, b) => {
    // Active (true) should come first, inactive (false/null) at end
    const aActive = a.availability_status ?? false;
    const bActive = b.availability_status ?? false;
    
    // If both have same availability status, maintain original order
    if (aActive === bActive) return 0;
    
    // Active comes first (true > false)
    return bActive ? 1 : -1;
  });

  const [data, setData] = useState<Codev[]>(sortedInitialData);
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
            <span className="rounded-full bg-blue-500 px-2.5 py-1 text-white shadow-sm sm:px-3 sm:py-1.5">
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
        <TableFilters
          filters={filters}
          onFilterChange={(key, value) =>
            setFilters((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>

      {/* Table View Only */}
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

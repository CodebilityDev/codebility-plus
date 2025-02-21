"use client";

import { useState } from "react";
import { H1 } from "@/Components/shared/home";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import { InHouseTable } from "./table/InHouseTable";
import { TableFilters } from "./table/table-filters";

interface InHouseViewProps {
  initialData: Codev[];
}

export default function InHouseView({ initialData }: InHouseViewProps) {
  const [data, setData] = useState<Codev[]>(initialData);

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    position: "",
    project: "",
    internal_status: "",
    nda_status: "",
    display_position: "",
    role: "",
  });

  // Filtering logic
  const filteredData = data.filter((item) => {
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
    <div className="max-w-screen-4xl mx-auto flex flex-col gap-4 p-4">
      <H1>In-House Codebility</H1>

      <div className="flex items-center justify-between">
        <p className="text-light-900 text-sm">
          {data.length} {data.length === 1 ? "member" : "members"}
        </p>
      </div>

      {/* Table filters */}
      <TableFilters
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      />

      {/* Table view only */}
      <InHouseTable {...sharedProps} />
    </div>
  );
}

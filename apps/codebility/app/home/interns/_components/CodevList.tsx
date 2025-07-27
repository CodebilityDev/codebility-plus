"use client";

import { useMemo } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";
import { getPrioritizedAndFilteredCodevs } from "@/utils/codev-priority"; // Import the utility

import CodevCard from "./CodevCard";

interface CodevListProps {
  data: Codev[];
  filters: {
    positions: string[];
    projects: string[];
    availability: string[];
  };
}

export default function CodevList({ data, filters }: CodevListProps) {
  // Use the new utility function to get prioritized and filtered codevs
  const filteredCodevs = useMemo(
    () => getPrioritizedAndFilteredCodevs(data, filters, true),
    [data, filters],
  );

  const {
    currentPage,
    totalPages,
    paginatedData,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination<Codev>(filteredCodevs, pageSize.codevsList);

  return (
    <div className="space-y-6">
      {paginatedData.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {paginatedData.map((codev) => (
            <CodevCard key={codev.id} codev={codev} />
          ))}
        </div>
      ) : (
        <p className="text-dark100_light900 text-center text-xl">
          No codevs found
        </p>
      )}

      {filteredCodevs.length > pageSize.codevsList && (
        <DefaultPagination
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

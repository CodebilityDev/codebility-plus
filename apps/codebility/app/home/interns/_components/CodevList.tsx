"use client";

import { useMemo } from "react";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

import { prioritizeCodevs } from "../_lib/codevpriority";
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
  const prioritizedCodevs = useMemo(() => prioritizeCodevs(data), [data]);

  const filteredCodevs = useMemo(() => {
    return prioritizedCodevs.filter((codev) => {
      const matchesPosition =
        filters.positions.length === 0 ||
        filters.positions.includes(codev.display_position || "");

      const matchesAvailability =
        filters.availability.length === 0 ||
        filters.availability
          .map((status) => status.toUpperCase())
          .includes(codev.internal_status || "");

      const matchesProject =
        filters.projects.length === 0 ||
        codev.projects?.some((project) =>
          filters.projects.includes(project.id),
        ) ||
        false;

      return matchesPosition && matchesAvailability && matchesProject;
    });
  }, [prioritizedCodevs, filters]);

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
        <p className="text-center text-xl text-gray-500">No codevs found</p>
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

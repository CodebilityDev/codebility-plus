"use client";

import { useMemo } from "react";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev, CodevPoints } from "@/types/home/codev";

import CodevCard from "./CodevCard";

interface CodevListProps {
  data: Codev[];
  filters: {
    positions: string[];
    projectStatus: string[];
    availability: string[];
    skillCategories: string[];
  };
}

export default function CodevList({ data, filters }: CodevListProps) {
  const filteredCodevs = useMemo(() => {
    return data.filter((codev) => {
      const matchesPosition =
        filters.positions.length === 0 ||
        filters.positions.includes(codev.display_position || "");

      const matchesAvailability =
        filters.availability.length === 0 ||
        filters.availability.includes(codev.internal_status || "");

      const matchesProject =
        filters.projectStatus.length === 0 ||
        (filters.projectStatus.includes("No Project") &&
          !codev.projects?.length) ||
        (filters.projectStatus.includes("Active Project") &&
          codev.projects?.length === 1) ||
        (filters.projectStatus.includes("Multiple Projects") &&
          (codev.projects?.length || 0) > 1);

      const matchesSkills =
        filters.skillCategories.length === 0 ||
        filters.skillCategories.some((catId) =>
          codev.codev_points?.some(
            (point: CodevPoints) => point.skill_category_id === catId,
          ),
        );

      return (
        matchesPosition &&
        matchesAvailability &&
        matchesProject &&
        matchesSkills
      );
    });
  }, [data, filters]);

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
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

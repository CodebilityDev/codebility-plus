"use client";

import { useMemo, useState, useEffect } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";
import { getPrioritizedAndFilteredCodevs } from "@/utils/codev-priority"; // Import the utility

import CodevCard from "./CodevCard";
import AnimatedCodevCardSkeleton from "./AnimatedCodevCardSkeleton";

interface CodevListProps {
  data: Codev[];
  filters: {
    positions: string[];
    projects: string[];
    availability: string[];
  };
  activeTab?: "all" | "active" | "inactive";
  isSearching?: boolean;
}

export default function CodevList({ data, filters, activeTab = "active", isSearching = false }: CodevListProps) {
  const [isFiltering, setIsFiltering] = useState(false);

  // Add a small delay to show loading when filters change
  useEffect(() => {
    if (Object.values(filters).some(arr => arr.length > 0) || isSearching) {
      setIsFiltering(true);
      const timer = setTimeout(() => {
        setIsFiltering(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [filters, isSearching]);
  // Use the new utility function to get prioritized and filtered codevs
  const filteredCodevs = useMemo(() => {
    // First filter by tab selection based on availability_status (same as in-house)
    let tabFilteredData = data;
    if (activeTab === "active") {
      tabFilteredData = data.filter(codev => codev.availability_status === true);
    } else if (activeTab === "inactive") {
      tabFilteredData = data.filter(codev => codev.availability_status !== true);
    }
    // activeTab === "all" shows everyone
    
    const result = getPrioritizedAndFilteredCodevs(tabFilteredData, filters, true);

    /*     // Console logs for debugging
    console.log("🔍 INTERNS PAGE DEBUG:");
    console.log("📊 Total data received:", data.length);
    console.log("🔄 Filters applied:", filters);
    console.log("✅ Final filtered results:", result.length); */

    // Log each displayed user with detailed info
    /*   console.log("👥 DISPLAYED USERS:");
    result.forEach((codev, index) => {
      console.log(`${index + 1}. ${codev.first_name} ${codev.last_name}`, {
        id: codev.id,
        application_status: codev.application_status,
        availability_status: codev.availability_status,
        internal_status: codev.internal_status,
        display_position: codev.display_position,
        role_id: codev.role_id,
        years_of_experience: codev.years_of_experience
      });
    }); */

    // Summary by application status
    /* const statusCounts = result.reduce(
      (acc, codev) => {
        const status = codev.application_status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ); */

    /*   console.log("📈 STATUS BREAKDOWN:", statusCounts);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"); */

    return result;
  }, [data, filters, activeTab]);

  console.log("📊 FILTERED CODEVS:", filteredCodevs.length);
  console.log("🔍 FILTERS USED:", filters);

  const {
    currentPage,
    totalPages,
    paginatedData,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination<Codev>(filteredCodevs, pageSize.codevsList);

  return (
    <div className="space-y-8">
      {isFiltering ? (
        // Show skeleton while filtering
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <AnimatedCodevCardSkeleton key={index} delay={index * 100} />
          ))}
        </div>
      ) : paginatedData.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {paginatedData.map((codev) => (
            <CodevCard key={codev.id} codev={codev} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md rounded-2xl bg-gray-50/80 p-12 text-center backdrop-blur-sm dark:bg-gray-800/60">
          <div className="mb-6 text-6xl">👥</div>
          <h3 className="mb-4 text-2xl font-light text-gray-900 dark:text-white">
            No developers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters to find more
            developers.
          </p>
        </div>
      )}

      {!isFiltering && filteredCodevs.length > pageSize.codevsList && (
        <div className="flex justify-center">
          <DefaultPagination
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

"use client";

import DefaultPagination from "@/components/ui/pagination";
import type { CodevCardRow } from "@/lib/server/codev.service";

import CodevCard from "./CodevCard";
import AnimatedCodevCardSkeleton from "./AnimatedCodevCardSkeleton";

interface CodevListProps {
  data: CodevCardRow[];
  isFetching?: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    onNextPage: () => void;
    onPreviousPage: () => void;
    onGoToPage: (page: number) => void;
  };
}

export default function CodevList({ data, isFetching, pagination }: CodevListProps) {
  const setCurrentPage = (pageOrFunction: number | ((page: number) => number)) => {
    const page =
      typeof pageOrFunction === "function"
        ? pageOrFunction(pagination.currentPage)
        : pageOrFunction;
    pagination.onGoToPage(Math.max(1, Math.min(page, pagination.totalPages)));
  };

  return (
    <div className="space-y-8">
      {isFetching && data.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <AnimatedCodevCardSkeleton key={index} delay={index * 100} />
          ))}
        </div>
      ) : data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
          {data.map((codev) => (
            <CodevCard key={codev.id} codev={codev} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md rounded-2xl bg-white/10 backdrop-blur-sm p-12 text-center dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-xl">
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

      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <DefaultPagination
            currentPage={pagination.currentPage}
            handleNextPage={pagination.onNextPage}
            handlePreviousPage={pagination.onPreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={pagination.totalPages}
          />
        </div>
      )}
    </div>
  );
}

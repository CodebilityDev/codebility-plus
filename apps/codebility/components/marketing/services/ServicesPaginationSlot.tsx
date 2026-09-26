"use client";

import DefaultPagination from "@/components/global/ui/DefaultPagination";
import type { ServicesPaginationSlotProps } from "@/types/marketing/services/services";

export function ServicesPaginationSlot({
  page,
  totalPages,
  onPageChange,
}: ServicesPaginationSlotProps) {
  if (totalPages <= 1) {
    return <div className="mt-6 min-h-[4.5rem]" aria-hidden="true" />;
  }

  const currentPage = Math.min(page, totalPages);

  return (
    <div id="services-pagination" className="mt-6 min-h-[4.5rem] text-white">
      <DefaultPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleNextPage={() => {
          onPageChange(Math.min(totalPages, currentPage + 1));
        }}
        handlePreviousPage={() => {
          onPageChange(Math.max(1, currentPage - 1));
        }}
        setCurrentPage={onPageChange}
      />
    </div>
  );
}

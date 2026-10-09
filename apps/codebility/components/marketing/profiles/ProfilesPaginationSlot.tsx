"use client";

import DefaultPagination from "@/components/global/ui/DefaultPagination";
import type { ProfilesPaginationSlotProps } from "@/types/marketing/profiles/profiles";

export function ProfilesPaginationSlot({
  page,
  totalPages,
  onPageChange,
}: ProfilesPaginationSlotProps) {
  if (totalPages <= 1) {
    return <div className="mt-6 min-h-[4.5rem]" aria-hidden="true" />;
  }

  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mt-6 text-white">
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

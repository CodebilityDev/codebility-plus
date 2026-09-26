"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationControlsProps } from "@/types/marketing/marketing";

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return <div className="mt-8 min-h-9" aria-hidden="true" />;
  }

  return (
    <div className="relative z-[100] mt-8 flex min-h-9 items-center gap-3">
      {page <= 1 ? (
        <span
          aria-disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50"
        >
          <ChevronLeft size={16} className="shrink-0" />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          className="pointer-events-auto relative z-[100] inline-flex h-9 w-9 items-center justify-center rounded-full border border-white hover:bg-white/10"
        >
          <ChevronLeft size={16} className="shrink-0" />
        </button>
      )}

      <div className="px-4 text-sm tabular-nums text-gray-600 dark:text-gray-300">
        Page {page} of {totalPages}
      </div>

      {page >= totalPages ? (
        <span
          aria-disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50"
        >
          <ChevronRight size={16} className="shrink-0" />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          className="pointer-events-auto relative z-[100] inline-flex h-9 w-9 items-center justify-center rounded-full border border-white hover:bg-white/10"
        >
          <ChevronRight size={16} className="shrink-0" />
        </button>
      )}
    </div>
  );
}

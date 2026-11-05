"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { LandingInternPaginationChromeProps } from "@/types/marketing/marketing";

export function LandingInternPaginationChrome({
  page,
  totalPages,
}: LandingInternPaginationChromeProps) {
  return (
    <div
      className="relative z-[100] mt-8 flex min-h-9 items-center gap-3"
      aria-hidden="true"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50">
        <ChevronLeft size={16} className="shrink-0" />
      </span>
      <div className="px-4 text-sm tabular-nums text-gray-600 dark:text-gray-300">
        Page {page} of {totalPages}
      </div>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50">
        <ChevronRight size={16} className="shrink-0" />
      </span>
    </div>
  );
}

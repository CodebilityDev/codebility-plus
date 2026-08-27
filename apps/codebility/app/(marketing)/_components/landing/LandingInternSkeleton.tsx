"use client";

import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARD_COUNT = 10;

export function LandingInternCardsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl py-10" aria-busy="true">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex w-full flex-col items-center rounded-sm border border-neutral-700 bg-black-800"
            style={{ height: 270 }}
            aria-hidden="true"
          >
            <div className="flex h-full w-full flex-col items-center p-3 sm:p-4">
              <div className="flex items-center justify-center pb-0 pt-6">
                <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
              </div>
              <div className="flex w-full flex-grow flex-col items-center justify-center space-y-2 sm:space-y-3">
                <p className="invisible px-1 text-center text-xs font-medium leading-tight sm:px-2 sm:text-sm">
                  Member Name Here
                </p>
                <span className="invisible rounded-full px-2 py-1 text-xs font-medium sm:px-3">
                  Codev
                </span>
                <p className="invisible px-1 text-center text-xs leading-tight sm:px-2 sm:text-sm">
                  Developer
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingInternPaginationChrome({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
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

export default function LandingInternSkeleton({
  page = 1,
  totalPages = 1,
  showPagination = true,
}: {
  page?: number;
  totalPages?: number;
  showPagination?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full min-h-[300px]">
        <LandingInternCardsSkeleton />
      </div>
      {showPagination && totalPages > 1 && (
        <LandingInternPaginationChrome page={page} totalPages={totalPages} />
      )}
      {showPagination && totalPages <= 1 && (
        <div className="mt-8 min-h-9" aria-hidden="true" />
      )}
    </div>
  );
}

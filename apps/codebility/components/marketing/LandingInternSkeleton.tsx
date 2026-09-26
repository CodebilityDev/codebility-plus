"use client";
import { LandingInternCardsSkeleton } from "@/components/marketing/LandingInternCardsSkeleton";
import { LandingInternPaginationChrome } from "@/components/marketing/LandingInternPaginationChrome";
import type { LandingInternSkeletonProps } from "@/types/marketing/marketing";

export default function LandingInternSkeleton({
  page = 1,
  totalPages = 1,
  showPagination = true,
}: LandingInternSkeletonProps) {
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

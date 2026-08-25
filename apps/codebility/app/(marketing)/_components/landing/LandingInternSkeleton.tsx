import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARD_COUNT = 10;

export function LandingInternCardsSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto py-10" aria-busy="true">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <div
            key={i}
            className="flex w-full flex-col items-center rounded-sm border border-neutral-700 bg-black-800"
            style={{ height: 270 }}
            aria-hidden="true"
          >
            <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 p-3">
              <Skeleton className="h-20 w-20 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-[70%] bg-white/10" />
              <Skeleton className="h-5 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-[55%] bg-white/10" />
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
      className="flex items-center gap-3 relative z-[100] mt-8 min-h-9"
      aria-hidden="true"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50">
        <ChevronLeft size={16} className="shrink-0" />
      </span>
      <div className="text-sm text-gray-600 dark:text-gray-300 px-4 tabular-nums">
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
    <div className="w-full flex flex-col items-center gap-6">
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

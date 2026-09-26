"use client";

import { Suspense, useState, useTransition } from "react";

import { useMarketingPageUrl } from "@/hooks/global/use-marketing-page-url";




import { LandingInternCardsSkeleton } from "@/components/marketing/LandingInternCardsSkeleton";
import { PaginationControls } from "@/components/marketing/PaginationControls";
import { LandingInternCards } from "@/components/marketing/LandingInternCards";
import { rememberPagination, resolvePagination } from "@/lib/marketing/landing-intern-codev-pagination-loader";
import type { LandingInternPaginationProps } from "@/types/marketing/marketing";

export default function LandingInternPagination({
  initialData,
  pageSize = 10,
}: LandingInternPaginationProps) {
  const [page, setPage] = useState(initialData.pagination.page);
  const [isPending, startTransition] = useTransition();

  rememberPagination(
    initialData.pagination.page,
    pageSize,
    initialData.pagination,
  );

  const activePagination = resolvePagination(page, pageSize, initialData);
  const totalPages = Math.max(1, activePagination.totalPages);

  useMarketingPageUrl(page, (nextPage) => {
    startTransition(() => {
      setPage(nextPage);
    });
  });

  const onPageChange = (nextPage: number) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        className={`relative z-10 w-full min-h-[300px] transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <Suspense key={page} fallback={<LandingInternCardsSkeleton />}>
          <LandingInternCards
            page={page}
            pageSize={pageSize}
            initialData={initialData}
          />
        </Suspense>
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

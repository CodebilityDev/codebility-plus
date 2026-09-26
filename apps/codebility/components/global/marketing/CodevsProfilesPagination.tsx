"use client";

import { Suspense, useState, useTransition } from "react";


import { useMarketingPageUrl } from "@/hooks/global/use-marketing-page-url";





import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import { CodevsProfilesSkeleton } from "@/components/global/marketing/CodevsProfilesSkeleton";

import { CodevsPaginationSlot } from "@/components/global/marketing/CodevsPaginationSlot";
import type { CodevsProfilesPaginationProps } from "@/types/global/marketing";
import { CodevsProfilesGrid } from "@/components/global/marketing/CodevsProfilesGrid";
import { rememberPagination, resolvePagination } from "@/lib/global/codevs-profiles-pagination-loader";



export default function CodevsProfilesPagination({
  initialData,
  pageSize,
}: CodevsProfilesPaginationProps) {
  const [position, setPosition] = useState(initialData.position);
  const [page, setPage] = useState(initialData.pagination.page);
  const [isPending, startTransition] = useTransition();

  rememberPagination(
    initialData.position,
    initialData.pagination.page,
    pageSize,
    initialData.pagination,
  );

  const activePagination = resolvePagination(
    position,
    page,
    pageSize,
    initialData,
  );

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

  const onPositionChange = (nextPosition: string) => {
    startTransition(() => {
      setPosition(nextPosition);
      setPage(1);
    });
  };

  return (
    <div className="m-auto h-full w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <CodevListFilter
        selectedPosition={position}
        setSelectedPosition={onPositionChange}
        users={initialData.codevs}
        positions={initialData.positions}
      />

      <div
        className={`transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <Suspense
          key={`${position}:${page}`}
          fallback={<CodevsProfilesSkeleton count={pageSize} />}
        >
          <CodevsProfilesGrid
            position={position}
            page={page}
            pageSize={pageSize}
            initialData={initialData}
          />
        </Suspense>
      </div>

      <CodevsPaginationSlot
        page={page}
        totalPages={Math.max(0, activePagination.totalPages)}
        onPageChange={onPageChange}
      />
    </div>
  );
}

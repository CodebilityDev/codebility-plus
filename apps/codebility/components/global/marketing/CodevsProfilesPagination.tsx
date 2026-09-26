"use client";

import { Suspense, use, useState, useTransition } from "react";


import { useMarketingPageUrl } from "@/hooks/global/use-marketing-page-url";

import type { CodevsProfilesPage } from "@/types/global/codevs-profiles";
import { fetchApiJson } from "@/utils/global/api-fetch";


import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import { CodevsProfilesSkeleton } from "@/components/global/marketing/CodevsProfilesSkeleton";
import { CodevsGrid } from "@/components/global/marketing/CodevsGrid";
import { CodevsPaginationSlot } from "@/components/global/marketing/CodevsPaginationSlot";
import type { CodevsProfilesPaginationProps } from "@/types/global/marketing";
import { pageCacheKey, filterCacheKey } from "@/utils/global/marketing";


const pagePromises = new Map<string, Promise<CodevsProfilesPage>>();
const pageMetaCache = new Map<string, CodevsProfilesPage["pagination"]>();

function rememberPagination(
  position: string,
  page: number,
  pageSize: number,
  pagination: CodevsProfilesPage["pagination"],
) {
  pageMetaCache.set(pageCacheKey(position, page, pageSize), pagination);
  pageMetaCache.set(filterCacheKey(position, pageSize), pagination);
}

function resolvePagination(
  position: string,
  page: number,
  pageSize: number,
  initialData: CodevsProfilesPage,
): CodevsProfilesPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(position, page, pageSize)) ??
    pageMetaCache.get(filterCacheKey(position, pageSize)) ??
    (position === initialData.position
      ? initialData.pagination
      : { page, limit: pageSize, total: 0, totalPages: 0 })
  );
}

function loadPage(
  position: string,
  page: number,
  pageSize: number,
  initialData: CodevsProfilesPage,
): Promise<CodevsProfilesPage> {
  const key = pageCacheKey(position, page, pageSize);
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    rememberPagination(
      position,
      page,
      pageSize,
      initialData.pagination,
    );
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(pageSize),
  });
  if (position) {
    params.set("position", position);
  }

  const promise = fetchApiJson<CodevsProfilesPage>(
    `/api/codevs-profiles?${params.toString()}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching codevs profiles page:", result.error);
      const fallback = {
        codevs: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        },
        positions: initialData.positions,
        position,
      };
      rememberPagination(position, page, pageSize, fallback.pagination);
      return fallback;
    }

    rememberPagination(position, page, pageSize, result.data.pagination);
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

function CodevsProfilesRemote({
  position,
  page,
  pageSize,
  initialData,
}: {
  position: string;
  page: number;
  pageSize: number;
  initialData: CodevsProfilesPage;
}) {
  const data = use(loadPage(position, page, pageSize, initialData));
  return <CodevsGrid codevs={data.codevs} page={page} />;
}

function CodevsProfilesGrid({
  position,
  page,
  pageSize,
  initialData,
}: {
  position: string;
  page: number;
  pageSize: number;
  initialData: CodevsProfilesPage;
}) {
  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    return <CodevsGrid codevs={initialData.codevs} page={page} />;
  }

  return (
    <CodevsProfilesRemote
      position={position}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
    />
  );
}

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

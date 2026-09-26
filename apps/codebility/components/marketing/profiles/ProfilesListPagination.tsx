"use client";

import { Suspense, use, useState, useTransition } from "react";

import { useMarketingPageUrl } from "@/hooks/global/use-marketing-page-url";

import type { ProfilesListingPage } from "@/types/global/profiles-listing";
import { fetchApiJson } from "@/utils/global/api-fetch";


import CodevListFilter from "@/components/global/marketing/CodevListFilter";
import { ProfilesListSkeleton } from "@/components/marketing/profiles/ProfilesListSkeleton";
import { ProfilesGrid } from "@/components/marketing/profiles/ProfilesGrid";
import { ProfilesPaginationSlot } from "@/components/marketing/profiles/ProfilesPaginationSlot";
import type { ProfilesListPaginationProps } from "@/types/marketing/profiles/profiles";
import { pageCacheKey, filterCacheKey } from "@/utils/marketing/profiles/profiles";



const pagePromises = new Map<string, Promise<ProfilesListingPage>>();
const pageMetaCache = new Map<string, ProfilesListingPage["pagination"]>();

function rememberPagination(
  position: string,
  page: number,
  pageSize: number,
  pagination: ProfilesListingPage["pagination"],
) {
  pageMetaCache.set(pageCacheKey(position, page, pageSize), pagination);
  pageMetaCache.set(filterCacheKey(position, pageSize), pagination);
}

function loadPage(
  position: string,
  page: number,
  pageSize: number,
  initialData: ProfilesListingPage,
): Promise<ProfilesListingPage> {
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

  const promise = fetchApiJson<ProfilesListingPage>(
    `/api/profiles-listing?${params.toString()}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching profiles listing page:", result.error);
      return {
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
    }

    rememberPagination(
      position,
      page,
      pageSize,
      result.data.pagination,
    );
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

function resolvePagination(
  position: string,
  page: number,
  pageSize: number,
  initialData: ProfilesListingPage,
): ProfilesListingPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(position, page, pageSize)) ??
    pageMetaCache.get(filterCacheKey(position, pageSize)) ??
    (position === initialData.position
      ? initialData.pagination
      : { page, limit: pageSize, total: 0, totalPages: 0 })
  );
}

function ProfilesListRemote({
  position,
  page,
  pageSize,
  initialData,
}: {
  position: string;
  page: number;
  pageSize: number;
  initialData: ProfilesListingPage;
}) {
  const data = use(loadPage(position, page, pageSize, initialData));

  return (
    <ProfilesGrid
      codevs={data.codevs}
      animationKey={`${position}:${page}`}
    />
  );
}

function ProfilesListGrid({
  position,
  page,
  pageSize,
  initialData,
}: {
  position: string;
  page: number;
  pageSize: number;
  initialData: ProfilesListingPage;
}) {
  const animationKey = `${position}:${page}`;

  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    return (
      <ProfilesGrid
        codevs={initialData.codevs}
        animationKey={animationKey}
      />
    );
  }

  return (
    <ProfilesListRemote
      position={position}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
    />
  );
}

export default function ProfilesListPagination({
  initialData,
  pageSize,
}: ProfilesListPaginationProps) {
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
          fallback={<ProfilesListSkeleton count={pageSize} />}
        >
          <ProfilesListGrid
            position={position}
            page={page}
            pageSize={pageSize}
            initialData={initialData}
          />
        </Suspense>
      </div>

      <ProfilesPaginationSlot
        page={page}
        totalPages={Math.max(0, activePagination.totalPages)}
        onPageChange={onPageChange}
      />
    </div>
  );
}

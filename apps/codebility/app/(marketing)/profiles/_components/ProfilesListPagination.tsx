"use client";

import { Suspense, use, useState, useTransition } from "react";
import DefaultPagination from "@/components/ui/pagination";
import { getStableColor } from "@/utils/getRandomColor";
import type { ProfilesListingPage } from "@/types/marketing/profiles-listing";
import { fetchApiJson } from "@/utils/api-fetch";

import CodevCard from "./CodevCard";
import CodevListFilter from "./CodevListFilter";
import { ProfilesListSkeleton } from "./ProfilesListSkeleton";

const pagePromises = new Map<string, Promise<ProfilesListingPage>>();
const pageMetaCache = new Map<string, ProfilesListingPage["pagination"]>();

function pageCacheKey(position: string, page: number, pageSize: number) {
  return `${position}:${page}:${pageSize}`;
}

function filterCacheKey(position: string, pageSize: number) {
  return `${position}:${pageSize}`;
}

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

function ProfilesGrid({ codevs }: { codevs: ProfilesListingPage["codevs"] }) {
  if (codevs.length === 0) {
    return (
      <p className="text-center text-2xl text-gray-500 dark:text-gray-400">
        Sorry, no data found.
      </p>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {codevs.map((codev) => (
        <CodevCard
          color={getStableColor(codev.id)}
          key={codev.id}
          codev={codev}
        />
      ))}
    </div>
  );
}

function ProfilesPaginationSlot({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
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

  return <ProfilesGrid codevs={data.codevs} />;
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
  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    return <ProfilesGrid codevs={initialData.codevs} />;
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

interface Props {
  initialData: ProfilesListingPage;
  pageSize: number;
}

export default function ProfilesListPagination({
  initialData,
  pageSize,
}: Props) {
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

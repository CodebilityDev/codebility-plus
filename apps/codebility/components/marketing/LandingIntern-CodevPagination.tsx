"use client";

import { Suspense, use, useState, useTransition } from "react";

import { useMarketingPageUrl } from "@/hooks/global/use-marketing-page-url";
import type { LandingInternsPage } from "@/types/global/lib";
import { fetchApiJson } from "@/utils/global/api-fetch";

import InternCards from "@/components/marketing/LandingIntern-CodevCard";
import { LandingInternCardsSkeleton } from "@/components/marketing/LandingInternCardsSkeleton";
import { PaginationControls } from "@/components/marketing/PaginationControls";
import { pageCacheKey, toTeamMembers } from "@/utils/marketing/marketing";


const pagePromises = new Map<string, Promise<LandingInternsPage>>();
const pageMetaCache = new Map<string, LandingInternsPage["pagination"]>();

function rememberPagination(
  page: number,
  pageSize: number,
  pagination: LandingInternsPage["pagination"],
) {
  pageMetaCache.set(pageCacheKey(page, pageSize), pagination);
  pageMetaCache.set(`rank:${pageSize}`, pagination);
}

function resolvePagination(
  page: number,
  pageSize: number,
  initialData: LandingInternsPage,
): LandingInternsPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(page, pageSize)) ??
    pageMetaCache.get(`rank:${pageSize}`) ??
    initialData.pagination
  );
}

function loadPage(
  page: number,
  pageSize: number,
  initialData: LandingInternsPage,
): Promise<LandingInternsPage> {
  const key = pageCacheKey(page, pageSize);
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (page === initialData.pagination.page) {
    rememberPagination(page, pageSize, initialData.pagination);
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const promise = fetchApiJson<LandingInternsPage>(
    `/api/landing-interns?page=${page}&limit=${pageSize}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching landing interns page:", result.error);
      const fallback = {
        TEAM_MEMBERS: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: Math.max(1, initialData.pagination.totalPages),
        },
      };
      rememberPagination(page, pageSize, fallback.pagination);
      return fallback;
    }

    rememberPagination(page, pageSize, result.data.pagination);
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

function LandingInternCardsRemote({
  page,
  pageSize,
  initialData,
}: {
  page: number;
  pageSize: number;
  initialData: LandingInternsPage;
}) {
  const data = use(loadPage(page, pageSize, initialData));
  return (
    <InternCards
      key={page}
      interns={toTeamMembers(data.TEAM_MEMBERS)}
      playOnMount
    />
  );
}

function LandingInternCards({
  page,
  pageSize,
  initialData,
}: {
  page: number;
  pageSize: number;
  initialData: LandingInternsPage;
}) {
  if (page === initialData.pagination.page) {
    return (
      <InternCards
        key={page}
        interns={toTeamMembers(initialData.TEAM_MEMBERS)}
        playOnMount={page > 1}
      />
    );
  }

  return (
    <LandingInternCardsRemote
      page={page}
      pageSize={pageSize}
      initialData={initialData}
    />
  );
}

export default function LandingInternPagination({
  initialData,
  pageSize = 10,
}: {
  initialData: LandingInternsPage;
  pageSize?: number;
}) {
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

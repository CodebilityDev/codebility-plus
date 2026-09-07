"use client";

import { Suspense, use, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMarketingPageUrl } from "@/hooks/marketing/use-marketing-page-url";
import type { LandingInternsPage } from "@/lib/server/landing-interns-cached";
import { fetchApiJson } from "@/utils/api-fetch";

import InternCards from "./LandingIntern-CodevCard";
import { LandingInternCardsSkeleton } from "./LandingInternSkeleton";

export type PersonRole = "Intern" | "Codev";

export type LandingInternMember = {
  id: string;
  name: string;
  role: PersonRole;
  image?: string;
  display_position?: string;
};

const pagePromises = new Map<string, Promise<LandingInternsPage>>();
const pageMetaCache = new Map<string, LandingInternsPage["pagination"]>();

function pageCacheKey(page: number, pageSize: number) {
  return `rank:${page}:${pageSize}`;
}

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

function toTeamMembers(
  members: LandingInternsPage["TEAM_MEMBERS"],
): LandingInternMember[] {
  return members.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role === "Codev" ? "Codev" : "Intern",
    image: member.image,
    display_position: member.display_position,
  }));
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

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return <div className="mt-8 min-h-9" aria-hidden="true" />;
  }

  return (
    <div className="relative z-[100] mt-8 flex min-h-9 items-center gap-3">
      {page <= 1 ? (
        <span
          aria-disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50"
        >
          <ChevronLeft size={16} className="shrink-0" />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          className="pointer-events-auto relative z-[100] inline-flex h-9 w-9 items-center justify-center rounded-full border border-white hover:bg-white/10"
        >
          <ChevronLeft size={16} className="shrink-0" />
        </button>
      )}

      <div className="px-4 text-sm tabular-nums text-gray-600 dark:text-gray-300">
        Page {page} of {totalPages}
      </div>

      {page >= totalPages ? (
        <span
          aria-disabled
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50"
        >
          <ChevronRight size={16} className="shrink-0" />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          className="pointer-events-auto relative z-[100] inline-flex h-9 w-9 items-center justify-center rounded-full border border-white hover:bg-white/10"
        >
          <ChevronRight size={16} className="shrink-0" />
        </button>
      )}
    </div>
  );
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

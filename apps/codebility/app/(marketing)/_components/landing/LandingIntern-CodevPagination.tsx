"use client";

import { Suspense, use, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InternCards from "./LandingIntern-CodevCard";
import { LandingInternCardsSkeleton } from "./LandingInternSkeleton";
import type { LandingInternsPage } from "@/lib/server/landing-interns-cached";
import { fetchApiJson } from "@/utils/api-fetch";

export type PersonRole = "Intern" | "Codev";

export type LandingInternMember = {
  id: string;
  name: string;
  role: PersonRole;
  image?: string;
  display_position?: string;
};

const pagePromises = new Map<string, Promise<LandingInternsPage>>();

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
  const key = `rank:${page}:${pageSize}`;
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (page === initialData.pagination.page) {
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
      return {
        TEAM_MEMBERS: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: Math.max(1, initialData.pagination.totalPages),
        },
      };
    }
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
    <div className="flex items-center gap-3 relative z-[100] mt-8 min-h-9">
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white relative z-[100] pointer-events-auto hover:bg-white/10"
        >
          <ChevronLeft size={16} className="shrink-0" />
        </button>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-300 px-4 tabular-nums">
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white relative z-[100] pointer-events-auto hover:bg-white/10"
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
  return <InternCards interns={toTeamMembers(data.TEAM_MEMBERS)} />;
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
      <InternCards interns={toTeamMembers(initialData.TEAM_MEMBERS)} />
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
  const totalPages = Math.max(1, initialData.pagination.totalPages);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        className={`relative z-10 w-full min-h-[300px] transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <Suspense fallback={<LandingInternCardsSkeleton />}>
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
        onPageChange={(nextPage) => {
          startTransition(() => {
            setPage(nextPage);
          });
        }}
      />
    </div>
  );
}

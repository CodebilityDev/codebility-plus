"use client";

import { Suspense, use, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InternCards from "./LandingIntern-CodevCard";
import {
  LandingInternCardsSkeleton,
} from "./LandingInternSkeleton";
import { fetchApiJson } from "@/utils/api-fetch";

export type PersonRole = "Intern" | "Codev";

export type LandingInternMember = {
  id: string;
  name: string;
  role: PersonRole;
  image?: string;
  display_position?: string;
};

export type LandingInternsApiResponse = {
  TEAM_MEMBERS: Array<{
    id: string;
    name: string;
    role: string;
    image?: string;
    display_position?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
};

const PAGE_EVENT = "landing-interns-page";
const pagePromises = new Map<string, Promise<LandingInternsApiResponse>>();

function toTeamMembers(
  members: LandingInternsApiResponse["TEAM_MEMBERS"],
): LandingInternMember[] {
  return members.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role === "Codev" ? "Codev" : "Intern",
    image: member.image,
    display_position: member.display_position,
  }));
}

function parsePage(value: string | null): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function pageHref(page: number) {
  if (page <= 1) return "/#codevs";
  return `/?page=${page}#codevs`;
}

function getPageFromLocation(): number {
  if (typeof window === "undefined") return 1;
  return parsePage(new URL(window.location.href).searchParams.get("page"));
}

function subscribePage(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(PAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(PAGE_EVENT, onStoreChange);
  };
}

function goToPage(page: number) {
  window.history.pushState(null, "", pageHref(page));
  window.dispatchEvent(new Event(PAGE_EVENT));
}

function loadPage(
  page: number,
  pageSize: number,
  initialData: LandingInternsApiResponse,
): Promise<LandingInternsApiResponse> {
  const key = `rank:${page}:${pageSize}`;
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (page === initialData.pagination.page) {
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const promise = fetchApiJson<LandingInternsApiResponse>(
    `/api/landing-interns?page=${page}&limit=${pageSize}&sort=rank`,
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
  if (totalPages <= 1) return <div className="mt-8 min-h-9" aria-hidden="true" />;

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
  initialData: LandingInternsApiResponse;
}) {
  const data = use(loadPage(page, pageSize, initialData));
  return (
    <InternCards key={page} interns={toTeamMembers(data.TEAM_MEMBERS)} />
  );
}

function LandingInternCards({
  page,
  pageSize,
  initialData,
}: {
  page: number;
  pageSize: number;
  initialData: LandingInternsApiResponse;
}) {
  if (page === initialData.pagination.page) {
    return (
      <InternCards
        key={page}
        interns={toTeamMembers(initialData.TEAM_MEMBERS)}
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
  initialData: LandingInternsApiResponse;
  pageSize?: number;
}) {
  const searchParams = useSearchParams();
  const page = useSyncExternalStore(
    subscribePage,
    getPageFromLocation,
    () => parsePage(searchParams.get("page")),
  );
  const totalPages = Math.max(1, initialData.pagination.totalPages);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full min-h-[300px]">
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
        onPageChange={goToPage}
      />
    </div>
  );
}

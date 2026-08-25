"use client";

import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InternCards from "./LandingIntern-CodevCard";
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

function loadPage(
  page: number,
  pageSize: number,
  initialData: LandingInternsApiResponse,
): Promise<LandingInternsApiResponse> {
  if (page === initialData.pagination.page) {
    return Promise.resolve(initialData);
  }

  const key = `${page}:${pageSize}`;
  const cached = pagePromises.get(key);
  if (cached) return cached;

  const promise = fetchApiJson<LandingInternsApiResponse>(
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
          totalPages: 0,
        },
      };
    }
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

export default function LandingInternPagination({
  initialData,
  pageSize = 10,
}: {
  initialData: LandingInternsApiResponse;
  pageSize?: number;
}) {
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const data = use(loadPage(page, pageSize, initialData));

  const totalPages = Math.max(1, data.pagination.totalPages);
  const members = toTeamMembers(data.TEAM_MEMBERS);

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full min-h-[300px]">
        <InternCards key={page} interns={members} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-3 relative z-[100] mt-8">
          {page <= 1 ? (
            <span
              aria-disabled
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white opacity-50"
            >
              <ChevronLeft size={16} className="shrink-0" />
            </span>
          ) : (
            <Link
              href={pageHref(page - 1)}
              scroll={false}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white relative z-[100] pointer-events-auto hover:bg-white/10"
            >
              <ChevronLeft size={16} className="shrink-0" />
            </Link>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-300 px-4">
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
            <Link
              href={pageHref(page + 1)}
              scroll={false}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white relative z-[100] pointer-events-auto hover:bg-white/10"
            >
              <ChevronRight size={16} className="shrink-0" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

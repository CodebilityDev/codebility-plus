"use client";

import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import InternCards from "./LandingIntern-CodevCard";
import { fetchApiJson } from "@/utils/api-fetch";

type PersonRole = "Intern" | "Codev";

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

function toTeamMembers(
  members: LandingInternsApiResponse["TEAM_MEMBERS"],
): LandingInternMember[] {
  return members.map((member) => ({
    ...member,
    role: member.role === "Codev" ? "Codev" : "Intern",
  }));
}

export default function TeamMembersPagination({
  initialData,
  pageSize = 10,
}: {
  initialData: LandingInternsApiResponse;
  pageSize?: number;
}) {
  const [members, setMembers] = useState(() =>
    toTeamMembers(initialData.TEAM_MEMBERS),
  );
  const [page, setPage] = useState(initialData.pagination.page);
  const [totalPages, setTotalPages] = useState(
    Math.max(1, initialData.pagination.totalPages),
  );
  const [isPending, startTransition] = useTransition();

  const loadPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;

    startTransition(async () => {
      const result = await fetchApiJson<LandingInternsApiResponse>(
        `/api/landing-interns?page=${nextPage}&limit=${pageSize}`,
      );

      if (!result.ok) {
        console.error("Error fetching landing interns page:", result.error);
        return;
      }

      setMembers(toTeamMembers(result.data.TEAM_MEMBERS));
      setPage(result.data.pagination.page);
      setTotalPages(Math.max(1, result.data.pagination.totalPages));
    });
  };

  const isPreviousDisabled = page <= 1 || isPending;
  const isNextDisabled = page >= totalPages || isPending;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full min-h-[300px]">
        <InternCards interns={members} />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-3 relative z-[100] mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => loadPage(page - 1)}
            disabled={isPreviousDisabled}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative z-[100] pointer-events-auto"
          >
            <ChevronLeft size={16} className="shrink-0" />
          </Button>

          <div className="text-sm text-gray-600 dark:text-gray-300 px-4">
            Page {page} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => loadPage(page + 1)}
            disabled={isNextDisabled}
            className="rounded-full w-9 h-9 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative z-[100] pointer-events-auto"
          >
            <ChevronRight size={16} className="shrink-0" />
          </Button>
        </div>
      )}
    </div>
  );
}

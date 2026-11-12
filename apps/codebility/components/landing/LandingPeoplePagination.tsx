"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/global/design-system/Button";
import { useLandingPeopleTransition } from "@/components/landing/LandingPeopleTransition";
import type { TeamFilter } from "@/types/global/landing-people";

interface LandingPeoplePaginationProps {
  filter: TeamFilter;
  page: number;
  totalPages: number;
}

function LandingPeoplePagination({
  filter,
  page,
  totalPages,
}: LandingPeoplePaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { navigate } = useLandingPeopleTransition();

  function pageHref(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (filter === "all") params.delete("team");
    else params.set("team", filter);

    if (nextPage > 1) params.set("teamPage", String(nextPage));
    else params.delete("teamPage");

    return params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() =>
          navigate(pageHref(page - 1), { replace: false })
        }
      >
        Previous
      </Button>
      <span className="text-sm text-[color:var(--cb-text-muted)]">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() =>
          navigate(pageHref(page + 1), { replace: false })
        }
      >
        Next
      </Button>
    </div>
  );
}

export { LandingPeoplePagination };

"use client";

import { Button } from "@/components/global/design-system/Button";
import { useLandingSearchTransition } from "@/components/landing/LandingSearchTransition";

interface LandingSearchPaginationProps {
  query: string;
  page: number;
  totalPages: number;
}

function resultsHref(query: string, page: number): string {
  const params = new URLSearchParams({ search: query });

  if (page > 1) params.set("page", String(page));

  return `/?${params.toString()}`;
}

function LandingSearchPagination({
  query,
  page,
  totalPages,
}: LandingSearchPaginationProps) {
  const { navigate } = useLandingSearchTransition();

  return (
    <div className="flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() =>
          navigate(resultsHref(query, page - 1), { replace: false })
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
          navigate(resultsHref(query, page + 1), { replace: false })
        }
      >
        Next
      </Button>
    </div>
  );
}

export { LandingSearchPagination };

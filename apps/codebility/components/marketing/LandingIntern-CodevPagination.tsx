"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { LandingInternCardsSkeleton } from "@/components/marketing/LandingInternCardsSkeleton";
import { PaginationControls } from "@/components/marketing/PaginationControls";
import { LandingInternCards } from "@/components/marketing/LandingInternCards";
import type { LandingInternPaginationProps } from "@/types/marketing/marketing";

export default function LandingInternPagination({
  initialData,
}: LandingInternPaginationProps) {
  const router = useRouter();
  // The server still does the fetching. This only surfaces the in-flight state
  // of that navigation, which App Router would otherwise hide behind the
  // current page until the new RSC payload lands.
  const [isPending, startTransition] = useTransition();

  const page = initialData.pagination.page;
  const totalPages = Math.max(1, initialData.pagination.totalPages);

  const goToPage = (nextPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (nextPage > 1) params.set("page", String(nextPage));
      const query = params.toString();
      router.replace(query ? `?page=${nextPage}` : "?", { scroll: false });
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative z-10 w-full min-h-[300px]">
        {isPending ? (
          <LandingInternCardsSkeleton />
        ) : (
          <LandingInternCards page={page} initialData={initialData} />
        )}
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
}

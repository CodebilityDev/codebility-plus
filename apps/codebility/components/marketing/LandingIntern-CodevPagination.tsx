"use client";

import { useRouter } from "next/navigation";

import { PaginationControls } from "@/components/marketing/PaginationControls";
import { LandingInternCards } from "@/components/marketing/LandingInternCards";
import type { LandingInternPaginationProps } from "@/types/marketing/marketing";

export default function LandingInternPagination({
  initialData,
}: LandingInternPaginationProps) {
  const router = useRouter();

  const page = initialData.pagination.page;
  const totalPages = Math.max(1, initialData.pagination.totalPages);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative z-10 w-full min-h-[300px]">
        <LandingInternCards page={page} initialData={initialData} />
      </div>

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => {
          const params = new URLSearchParams();
          if (nextPage > 1) params.set("page", String(nextPage));
          const query = params.toString();
          router.replace(query ? `?page=${nextPage}` : "?", { scroll: false });
        }}
      />
    </div>
  );
}

import LandingInternPagination from "@/components/marketing/LandingIntern-CodevPagination";
import LandingInternSkeleton from "@/components/marketing/LandingInternSkeleton";
import { PAGE_SIZE } from "@/constants/marketing/marketing";
import { getCachedLandingInternsPage } from "@/lib/global/landing-interns-cached";
import { parsePageParam } from "@/utils/global/page-param";
import { Suspense } from "react";
import type { LandingInternProps } from "@/types/marketing/marketing";

export async function LandingIntern({ searchParams }: LandingInternProps) {
  const query = await searchParams;
  const page = parsePageParam(query.page);

  const data = await getCachedLandingInternsPage(page, PAGE_SIZE);

  if (!data || data.TEAM_MEMBERS.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-gray-400">
        No team members available (Interns or Codevs)
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <LandingInternSkeleton
          page={page}
          totalPages={Math.max(1, data.pagination.totalPages)}
        />
      }
    >
      <LandingInternPagination initialData={data} pageSize={PAGE_SIZE} />
    </Suspense>
  );
}

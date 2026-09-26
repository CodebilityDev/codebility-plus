import LandingInternPagination from "@/components/marketing/LandingIntern-CodevPagination";
import LandingInternSkeleton from "@/components/marketing/LandingInternSkeleton";
import { PAGE_SIZE } from "@/constants/marketing/marketing";
import { getCachedLandingInternsPage } from "@/lib/global/landing-interns-cached";
import { Suspense } from "react";

export async function LandingIntern() {
  const data = await getCachedLandingInternsPage(1, PAGE_SIZE);

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
          page={1}
          totalPages={Math.max(1, data.pagination.totalPages)}
        />
      }
    >
      <LandingInternPagination initialData={data} pageSize={PAGE_SIZE} />
    </Suspense>
  );
}

import { Suspense } from "react";
import LandingInternPagination from "./LandingIntern-CodevPagination";
import LandingInternSkeleton from "./LandingInternSkeleton";
import LandingInternShell from "./LandingInternShell";
import { getCachedLandingInternsPage } from "@/lib/server/landing-interns-cached";

const PAGE_SIZE = 10;

async function LandingIntern() {
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

export default function InternSectionContainer() {
  return (
    <LandingInternShell>
      <Suspense fallback={<LandingInternSkeleton />}>
        <LandingIntern />
      </Suspense>
    </LandingInternShell>
  );
}

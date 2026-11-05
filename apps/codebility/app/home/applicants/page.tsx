import { Suspense } from "react";

import NewApplicantFetchComp from "@/components/home/applicants/applicantFetchComp";
import { ApplicantsTableSkeleton } from "@/components/home/applicants/ApplicantsTableSkeleton";

export default function NewApplicants({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <Suspense fallback={<ApplicantsTableSkeleton />}>
          <NewApplicantFetchComp searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

import { Suspense } from "react";

import NewApplicantFetchComp from "@/components/home/applicants/applicantFetchComp";
import { ApplicantsTableSkeleton } from "@/components/home/applicants/ApplicantsTableSkeleton";

export const instant = false;

export default function NewApplicants() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <Suspense fallback={<ApplicantsTableSkeleton />}>
          <NewApplicantFetchComp />
        </Suspense>
      </div>
    </div>
  );
}

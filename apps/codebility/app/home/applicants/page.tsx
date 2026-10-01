import { Suspense } from "react";
import { connection } from "next/server";

import NewApplicantFetchComp from "@/components/home/applicants/applicantFetchComp";
import { ApplicantsTableSkeleton } from "@/components/home/applicants/ApplicantsTableSkeleton";

export const instant = false;

export default async function NewApplicants() {
  await connection();

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

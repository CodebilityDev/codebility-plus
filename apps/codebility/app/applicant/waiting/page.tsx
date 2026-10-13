import React, { Suspense } from "react";

import ApplicantFetchComp from "@/components/applicant/waiting/applicantFetchComp";
import WaitingSkeleton from "@/components/applicant/waiting/WaitingSkeleton";

export const instant = false;

export default function ApplicantWaitingPage() {
  return (
    <div>
      <Suspense fallback={<WaitingSkeleton />}>
        <ApplicantFetchComp />
      </Suspense>
    </div>
  );
}

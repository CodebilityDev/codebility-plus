import React, { Suspense } from "react";

import ApplicantFetchComp from "./_component/applicantFetchComp";
import Loading from "./loading";

export const dynamic = "force-dynamic";
export default async function ApplicantWaitingPage() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <ApplicantFetchComp />
      </Suspense>
    </div>
  );
}

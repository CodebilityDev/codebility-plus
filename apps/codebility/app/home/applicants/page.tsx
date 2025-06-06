import React, { Suspense } from "react";

import NewApplicantFetchComp from "./_components/applicantFetchComp";
import ApplicantsLoading from "./loading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewApplicants() {
  return (
    <Suspense fallback={<ApplicantsLoading />}>
      <NewApplicantFetchComp />
    </Suspense>
  );
}

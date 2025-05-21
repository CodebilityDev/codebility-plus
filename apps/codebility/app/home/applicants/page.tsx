"use server";

import React, { Suspense } from "react";

import NewApplicantFetchComp from "./_components/applicantFetchComp";
import ApplicantsLoading from "./loading";

export default async function NewApplicants() {
  return (
    <Suspense fallback={<ApplicantsLoading />}>
      <NewApplicantFetchComp />
    </Suspense>
  );
}

"use server";

import React, { Suspense } from "react";

import ApplicantLists from "./_components/applicantLists";
import getNewApplicants from "./_service/query";
import { NewApplicantType } from "./_service/types";
import ApplicantsLoading from "./loading";

export default async function NewApplicants() {
  return (
    <Suspense fallback={<ApplicantsLoading />}>
      <NewApplicantFetchComp />
    </Suspense>
  );
}

export async function NewApplicantFetchComp() {
  const applicant: NewApplicantType[] = await getNewApplicants();

  return (
    <div>
      <ApplicantLists applicants={applicant} />
    </div>
  );
}

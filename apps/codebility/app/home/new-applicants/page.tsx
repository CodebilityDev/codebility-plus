import React, { Suspense } from "react";
import { NewApplicantType } from "./_service/types";
import ApplicantLists from "./_components/applicantLists";
import getNewApplicants from "./_service/query";

export default async function NewApplicants() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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

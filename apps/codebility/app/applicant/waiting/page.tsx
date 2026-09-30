import React from "react";

import ApplicantFetchComp from "@/components/applicant/waiting/applicantFetchComp";

export const instant = false;

export default async function ApplicantWaitingPage() {
  return (
    <div>
        <ApplicantFetchComp />
    </div>
  );
}
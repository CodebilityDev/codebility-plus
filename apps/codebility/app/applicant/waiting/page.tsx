import React from "react";

import ApplicantFetchComp from "@/components/applicant/waiting/applicantFetchComp";

export const dynamic = "force-dynamic";
export default async function ApplicantWaitingPage() {
  return (
    <div>
        <ApplicantFetchComp />
    </div>
  );
}

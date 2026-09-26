"use client";

import React from "react";






import { ApplicantType } from "@/types/applicant/waiting/applicant-waiting";
import { PostReadInstructions } from "@/components/applicant/waiting/PostReadInstructions";
import { PostSubmitted } from "@/components/applicant/waiting/PostSubmitted";
import { PreReadInstructions } from "@/components/applicant/waiting/PreReadInstructions";





export default function ApplicantStep2({
  setActiveStep,
  user,
  applicantData,
}: {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  user: any;
  applicantData: ApplicantType;
}) {
  const takenTest = applicantData.test_taken ? true : false;
  const submittedTest = applicantData.fork_url ? true : false;

  return (
    <div className="my-20 flex flex-col items-center gap-8 text-center lg:gap-10">
      {takenTest && !submittedTest && (
        <PostReadInstructions applicantData={applicantData} user={user} />
      )}

      {!takenTest && !submittedTest && (
        <PreReadInstructions applicantData={applicantData} user={user} />
      )}

      {submittedTest && (
        <PostSubmitted applicantData={applicantData} user={user} />
      )}
    </div>
  );
}
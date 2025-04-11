"use client";

import ApplicantsTableContainer from "@/app/home/applicants/_components/ApplicantsTableContainer";
import { Codev } from "@/types/home/codev";

// The component now receives filtered applicants and assessment-related props
const ApplicantsList = ({
  applicants,
  trackAssessmentSent,
  sentAssessments,
}: {
  applicants: Codev[];
  trackAssessmentSent?: (applicantId: string) => void;
  sentAssessments?: Record<string, boolean>;
}) => {
  // All filtering and sorting is now handled in the parent component
  return (
    <ApplicantsTableContainer
      applicants={applicants}
      trackAssessmentSent={trackAssessmentSent}
      sentAssessments={sentAssessments}
    />
  );
};

export default ApplicantsList;

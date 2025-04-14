"use client";

import ApplicantsTableContainer from "@/app/home/applicants/_components/ApplicantsTableContainer";
import { Codev } from "@/types/home/codev";

import { ApplicantStatus } from "./ApplicantsPageClient";

interface ApplicantsListProps {
  applicants: Codev[];
  trackAssessmentSent?: (applicantId: string) => void;
  sentAssessments?: Record<string, boolean>;
  activeTab: ApplicantStatus;
  onStatusChange?: () => void; // Add onStatusChange prop
}

const ApplicantsList = ({
  applicants,
  trackAssessmentSent,
  sentAssessments,
  activeTab,
  onStatusChange,
}: ApplicantsListProps) => {
  // All filtering and sorting is now handled in the parent component
  return (
    <ApplicantsTableContainer
      applicants={applicants}
      trackAssessmentSent={trackAssessmentSent}
      sentAssessments={sentAssessments}
      activeTab={activeTab}
      onStatusChange={onStatusChange} // Pass onStatusChange to container
    />
  );
};

export default ApplicantsList;

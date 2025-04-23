"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { ApplicantStatus, Codev } from "@/types/home/codev";

interface ApplicantsTableContainerProps {
  applicants: Codev[];
  trackAssessmentSent?: (applicantId: string) => void;
  sentAssessments?: Record<string, boolean>;
  activeTab: ApplicantStatus;
  onStatusChange?: () => void; // Add onStatusChange prop
}

const ApplicantsTableContainer = ({
  applicants,
  trackAssessmentSent,
  sentAssessments,
  activeTab,
  onStatusChange,
}: ApplicantsTableContainerProps) => {
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedApplicants,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage,
  } = usePagination(applicants || [], pageSize.applicants);

  // Reset pagination when tab or applicants list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, applicants.length, setCurrentPage]);

  const ApplicantsTableDesktop = dynamic(
    () => import("@/app/home/applicants/_components/ApplicantsTableDesktop"),
  );

  const ApplicantsTableMobile = dynamic(
    () => import("@/app/home/applicants/_components/ApplicantsTableMobile"),
  );

  return (
    <>
      <div className="hidden xl:block">
        <ApplicantsTableDesktop
          applicants={paginatedApplicants}
          trackAssessmentSent={trackAssessmentSent}
          sentAssessments={sentAssessments}
          onStatusChange={onStatusChange} // Pass onStatusChange to desktop view
        />
      </div>
      <div className="block xl:hidden">
        <ApplicantsTableMobile
          applicants={paginatedApplicants}
          trackAssessmentSent={trackAssessmentSent}
          sentAssessments={sentAssessments}
          onStatusChange={onStatusChange} // Pass onStatusChange to mobile view
        />
      </div>
      <div className="relative w-full">
        {applicants.length > pageSize.applicants && (
          <DefaultPagination
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </>
  );
};

export default ApplicantsTableContainer;

import dynamic from "next/dynamic";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

const ApplicantsTableContainer = ({
  applicants,
  trackAssessmentSent,
  sentAssessments,
}: {
  applicants: Codev[];
  trackAssessmentSent?: (applicantId: string) => void;
  sentAssessments?: Record<string, boolean>;
}) => {
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedApplicants,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage,
  } = usePagination(applicants || [], pageSize.applicants);

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
        />
      </div>
      <div className="block xl:hidden">
        <ApplicantsTableMobile
          applicants={paginatedApplicants}
          trackAssessmentSent={trackAssessmentSent}
          sentAssessments={sentAssessments}
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

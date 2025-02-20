import { Suspense } from "react";
import ApplicantsTableDesktop from "@/app/home/applicants/_components/ApplicantsTableDesktop";
import ApplicantsTableMobile from "@/app/home/applicants/_components/ApplicantsTableMobile";
import ApplicantsLoading from "@/app/home/applicants/loading";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

const ApplicantsTableContainer = ({ applicants }: { applicants: Codev[] }) => {
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedApplicants,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage,
  } = usePagination(applicants || [], pageSize.applicants);

  return (
    <>
      <Suspense fallback={<ApplicantsLoading />}>
        <ApplicantsTableDesktop applicants={paginatedApplicants} />
        <ApplicantsTableMobile applicants={paginatedApplicants} />
      </Suspense>
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

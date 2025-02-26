import dynamic from "next/dynamic";
import ApplicantsLoading from "@/app/home/applicants/loading";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Codev } from "@/types/home/codev";

const ApplicantsTableDesktop = dynamic(
  () => import("@/app/home/applicants/_components/ApplicantsTableDesktop"),
  { loading: () => <ApplicantsLoading /> },
);
const ApplicantsTableMobile = dynamic(
  () => import("@/app/home/applicants/_components/ApplicantsTableMobile"),
  { loading: () => <ApplicantsLoading /> },
);

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
      <ApplicantsTableDesktop applicants={paginatedApplicants} />
      <ApplicantsTableMobile applicants={paginatedApplicants} />

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

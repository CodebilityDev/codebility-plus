
import { ApplicantsList_Types } from '@/app/home/applicants/_types/applicants'
import ApplicantsTableDesktop from "@/app/home/applicants/_components/applicants-table-desktop"
import ApplicantsTableMobile from "@/app/home/applicants/_components/applicants-table-mobile"
import { Suspense } from 'react'
import ApplicantsLoading from "@/app/home/applicants/loading"
import usePagination from '@/hooks/use-pagination'
import { pageSize } from '@/constants'
import DefaultPagination from '@/Components/ui/pagination'

const ApplicantsTableContainer = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    const {
        currentPage,
        totalPages,
        paginatedData: paginatedApplicants,
        handlePreviousPage,
        handleNextPage,
        setCurrentPage,
    } = usePagination(applicants || [], pageSize.applicants)


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
    )
}

export default ApplicantsTableContainer
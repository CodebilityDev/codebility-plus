
import { ApplicantsList_Types } from '@/app/home/applicants/_types/applicants'
import ApplicantsTableDesktop from "@/app/home/applicants/_components/applicants-table-desktop"
import ApplicantsTableMobile from "@/app/home/applicants/_components/applicants-table-mobile"
import { Suspense } from 'react'
import ApplicantsLoading from "@/app/home/applicants/loading"
const ApplicantsTableContainer = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    return (
        <>
            <Suspense fallback={<ApplicantsLoading />}>
                <ApplicantsTableDesktop applicants={applicants} />
                <ApplicantsTableMobile applicants={applicants} />
            </Suspense>

        </>
    )
}

export default ApplicantsTableContainer
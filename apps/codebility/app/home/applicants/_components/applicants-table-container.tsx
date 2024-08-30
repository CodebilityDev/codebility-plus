
import { ApplicantsList_Types } from '@/app/home/applicants/_types/applicants'
import ApplicantsTableDesktop from "@/app/home/applicants/_components/applicants-table-desktop"
import ApplicantsTableMobile from "@/app/home/applicants/_components/applicants-table-mobile"

const ApplicantsTableContainer = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    return (
        <>
            <ApplicantsTableDesktop applicants={applicants} />
            <ApplicantsTableMobile applicants={applicants} />

        </>
    )
}

export default ApplicantsTableContainer
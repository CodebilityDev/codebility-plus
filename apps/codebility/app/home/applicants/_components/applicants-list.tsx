"use client";

import { Box, H1 } from "@/Components/shared/dashboard"
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants"
import ApplicantsTableContainer from "@/app/home/applicants/_components/applicants-table-container"
import { Toaster } from "react-hot-toast"

const ApplicantsList = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    return (
        <>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <H1>Applicants List</H1>
            </div>
            <Box>
                <ApplicantsTableContainer applicants={applicants} />
            </Box>
            <Toaster position="top-center" reverseOrder={false} />
        </>
    )
}

export default ApplicantsList




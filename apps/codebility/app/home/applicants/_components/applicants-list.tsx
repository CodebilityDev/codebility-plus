"use client";

import { H1 } from "@/Components/shared/dashboard"
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants"


const ApplicantsList = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    return (
        <>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <H1>Applicants List</H1>
            </ div>
        </>
    )
}

export default ApplicantsList
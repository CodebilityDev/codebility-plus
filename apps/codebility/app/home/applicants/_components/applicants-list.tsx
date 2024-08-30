"use client";

import { Box, H1 } from "@/Components/shared/dashboard"
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants"
import ApplicantsTableContainer from "@/app/home/applicants/_components/applicants-table-container"
import ApplicantsLoading from "@/app/home/applicants/loading"
import Search from "@/Components/shared/dashboard/Search"
import Error from "@/app/home/applicants/error"
import { Toaster } from "react-hot-toast"
import { useState } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query"

const ApplicantsList = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    const [filteredApplicants, setFilteredApplicants] = useState<ApplicantsList_Types[] | []>([])
    const [isDataFound, setIsDataFound] = useState<boolean>(false)

    const {
        data: Applicants,
        isLoading: LoadingApplicants,
        error: ErrorApplicants,
    }: UseQueryResult<ApplicantsList_Types[]> = useQuery({
        queryKey: ["applicants"],
        queryFn: () => {
            return applicants
        },
        refetchInterval: 3000,
    })

    if (LoadingApplicants) return <ApplicantsLoading />

    if (ErrorApplicants) return <Error error={ErrorApplicants} reset={() => { }} />

    const handleSubmit = (search: string) => {
        if (Applicants) {
            if (search.trim() === "") {
                setFilteredApplicants(Applicants);
                setIsDataFound(false);
            } else {
                const searchLowerCase = search.toLowerCase();
                const results = Applicants.filter((applicant) => {
                    const fullName = `${applicant.first_name} ${applicant.last_name}`.toLowerCase();
                    return fullName.includes(searchLowerCase);
                });

                setFilteredApplicants(results);
                setIsDataFound(results.length === 0);
            }
        }
    };


    const applicantsList = filteredApplicants.length > 0 ? filteredApplicants : (Applicants as ApplicantsList_Types[])


    return (
        <>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <H1>Applicants List</H1>
                <Search onSubmit={handleSubmit} placeholder="Search applicants" />
            </div>
            <Box>
                {isDataFound ? (
                    <div>No data found</div>
                ) : (
                    <ApplicantsTableContainer applicants={applicantsList} />
                )}
            </Box>
            <Toaster position="top-center" reverseOrder={false} />
        </>
    )
}

export default ApplicantsList




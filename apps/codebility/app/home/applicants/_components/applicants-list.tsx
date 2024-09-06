"use client";

import { Box, H1 } from "@/Components/shared/dashboard";
import { ApplicantsList_Types } from "@/app/home/applicants/_types/applicants";
import ApplicantsTableContainer from "@/app/home/applicants/_components/applicants-table-container";
import Search from "@/Components/shared/dashboard/Search";
import { Toaster } from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-applicants";

const ApplicantsList = ({ applicants }: { applicants: ApplicantsList_Types[] }) => {
    const [filteredApplicants, setFilteredApplicants] = useState<ApplicantsList_Types[] | []>([]);
    const [isDataFound, setIsDataFound] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const { onOpen } = useModal()

    const handleSubmit = useCallback(
        (search: string) => {
            if (search.trim() === "") {
                setFilteredApplicants(applicants);
                setIsDataFound(false);
            } else {
                const searchLowerCase = search.toLowerCase();
                const results = applicants.filter((applicant) => {
                    const fullName = `${applicant.first_name} ${applicant.last_name}`.toLowerCase();
                    return fullName.includes(searchLowerCase);
                });

                setFilteredApplicants(results);
                setIsDataFound(results.length === 0);
            }
        },
        [applicants]
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSubmit(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, handleSubmit]);

    useEffect(() => {
        setFilteredApplicants(applicants);
    }, [applicants]);

    const applicantsList = filteredApplicants.length > 0 ? filteredApplicants : applicants;

    return (
        <>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <H1>Applicants List</H1>
                <Search onSubmit={(value) => setSearchTerm(value)} placeholder="Search applicants" />
                <Button variant="default" size="sm" className="md:w-24"
                    onClick={() => onOpen("applicantsAddModal")}
                > Create</Button>
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
    );
};

export default ApplicantsList;

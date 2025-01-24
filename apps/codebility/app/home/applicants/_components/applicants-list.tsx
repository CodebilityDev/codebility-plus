"use client";

import { useCallback, useEffect, useState } from "react";
import ApplicantsTableContainer from "@/app/home/applicants/_components/applicants-table-container";
import { Box, H1 } from "@/Components/shared/dashboard";
import Search from "@/Components/shared/dashboard/Search";
import { Codev } from "@/types/home/codev";
import { Toaster } from "react-hot-toast";

const ApplicantsList = ({ applicants }: { applicants: Codev[] }) => {
  const [filteredApplicants, setFilteredApplicants] = useState<Codev[] | []>(
    [],
  );
  const [isDataFound, setIsDataFound] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = useCallback(
    (search: string) => {
      if (search.trim() === "") {
        setFilteredApplicants(applicants);
        setIsDataFound(false);
      } else {
        const searchLowerCase = search.toLowerCase();
        const results = applicants.filter((applicant) => {
          const fullName =
            `${applicant.first_name} ${applicant.last_name}`.toLowerCase();
          const email = applicant.email_address.toLowerCase();
          const portfolio = applicant.portfolio_website?.toLowerCase() || "";
          const github = applicant.github?.toLowerCase() || "";
          return (
            fullName.includes(searchLowerCase) ||
            email.includes(searchLowerCase) ||
            portfolio.includes(searchLowerCase) ||
            github.includes(searchLowerCase)
          );
        });

        setFilteredApplicants(results);
        setIsDataFound(results.length === 0);
      }
    },
    [applicants],
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

  const applicantsList =
    filteredApplicants.length > 0 ? filteredApplicants : applicants;

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <H1>Applicants List</H1>
        <Search
          onSubmit={(value) => setSearchTerm(value)}
          placeholder="Search applicants"
        />
      </div>
      <Box>
        {isDataFound || applicantsList.length === 0 ? (
          <div>No applicants found. The list is empty at this time.</div>
        ) : (
          <ApplicantsTableContainer applicants={applicantsList} />
        )}
      </Box>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default ApplicantsList;

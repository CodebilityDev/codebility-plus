"use client";

import { getApplicants } from "@/app/api/applicants";
import ApplicantTable from "@/app/home/applicants/ApplicantsList";
import Error from "@/app/home/applicants/error";
import Loading from "@/app/home/applicants/loading";
import { Box } from "@/Components/shared/dashboard";
import H1 from "@/Components/shared/dashboard/H1";
import { User } from "@/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

const ApplicantsPage = () => {
  const {
    data: Applicants,
    isLoading: LoadingApplicants,
    error: ErrorApplicants,
  }: UseQueryResult<User[]> = useQuery({
    queryKey: ["applicants"],
    queryFn: async () => {
      return await getApplicants();
    },
    refetchInterval: 3000,
  });

  if (LoadingApplicants) return <Loading />;

  if (ErrorApplicants)
    return <Error error={ErrorApplicants} reset={() => getApplicants()} />;

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Applicants List</H1>
      <Box>
        <ApplicantTable applicants={Applicants as User[]} />
      </Box>
    </div>
  );
};

export default ApplicantsPage;

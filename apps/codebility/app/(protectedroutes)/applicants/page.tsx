"use client"

import { useQuery, UseQueryResult } from "@tanstack/react-query"
import H1 from "@/Components/shared/dashboard/H1"
import { Box } from "@/Components/shared/dashboard"
import { getApplicants } from "@/app/api/applicants"
import ApplicantTable from "@/app/(protectedroutes)/applicants/ApplicantsList"
import { User } from "@/types"
import Error from "@/app/(protectedroutes)/applicants/error"
import Loading from "@/app/(protectedroutes)/applicants/loading"

const ApplicantsPage = () => {
  const {
    data: Applicants,
    isLoading: LoadingApplicants,
    error: ErrorApplicants,
  }: UseQueryResult<User[]> = useQuery({
    queryKey: ["applicants"],
    queryFn: async () => {
      return await getApplicants()
    },
    refetchInterval: 3000,
  })

  if (LoadingApplicants) return <Loading />

  if (ErrorApplicants) return <Error error={ErrorApplicants} reset={() => getApplicants()} />

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      <H1>Applicants List</H1>
      <Box>
        <ApplicantTable applicants={Applicants as User[]} />
      </Box>
    </div>
  )
}

export default ApplicantsPage

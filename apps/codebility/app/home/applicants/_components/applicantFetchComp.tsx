// apps/codebility/app/home/applicants/_components/applicantFetchComp.tsx

"use server";

import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";

import getNewApplicants from "../_service/query";
import { NewApplicantType } from "../_service/types";
import ApplicantLists from "./applicantLists";
import ApplicantClientWrapper from "./ApplicantClientWrapper";

export default async function NewApplicantFetchComp() {
  // Fetch applicants using correct service with caching enabled
  const applicant: NewApplicantType[] = await getOrSetCache(
    cacheKeys.codevs.applicants,
    () => getNewApplicants(),
    30,
  );

  // Handle no applicants case
  if (!applicant || applicant.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 text-4xl">📋</div>
        <h2 className="mb-2 text-xl font-semibold">No applicants found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          There are currently no applicants in the system.
        </p>
      </div>
    );
  }

  // Wrap with client component to handle modal rendering
  return (
    <ApplicantClientWrapper>
      <ApplicantLists applicants={applicant} />
    </ApplicantClientWrapper>
  );
}
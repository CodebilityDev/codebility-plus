"use server";

import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";

import getNewApplicants from "../_service/query";
import { NewApplicantType } from "../_service/types";
import ApplicantLists from "./applicantLists";

export default async function NewApplicantFetchComp() {
  /* const applicant: NewApplicantType[] = await getOrSetCache(
    cacheKeys.codevs.applicants,
    () => getNewApplicants(),
    30,
  ); */


  const applicant: NewApplicantType[] = await getNewApplicants();
  return (
    <div>
      <ApplicantLists applicants={applicant} />
    </div>
  );
}

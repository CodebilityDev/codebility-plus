"use server";

import getNewApplicants from "../_service/query";
import { NewApplicantType } from "../_service/types";
import ApplicantLists from "./applicantLists";

export default async function NewApplicantFetchComp() {
  const applicant: NewApplicantType[] = await getNewApplicants();

  return (
    <div>
      <ApplicantLists applicants={applicant} />
    </div>
  );
}

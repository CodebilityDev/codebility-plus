import { connection } from "next/server";

import NewApplicantFetchComp from "@/components/home/applicants/applicantFetchComp";
import { getNewApplicants } from "@/actions/home/applicants/applicants-queries";

export const instant = false;

export default async function NewApplicants() {
  await connection();
  const applicants = await getNewApplicants();

  return (
    <div className="mx-auto max-w-screen-xl">
      <div className="flex flex-col gap-4 pt-4">
        <NewApplicantFetchComp applicants={applicants} />
      </div>
    </div>
  );
}

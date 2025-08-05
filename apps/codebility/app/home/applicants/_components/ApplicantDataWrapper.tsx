import getNewApplicants from "../_service/query";
import { NewApplicantType } from "../_service/types";
import ApplicantLists from "./applicantLists";

export default async function ApplicantDataWrapper() {
  // Fetch applicants directly without caching
  const applicants: NewApplicantType[] = await getNewApplicants();

  // Handle no applicants case
  if (!applicants || applicants.length === 0) {
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

  return <ApplicantLists applicants={applicants} />;
}
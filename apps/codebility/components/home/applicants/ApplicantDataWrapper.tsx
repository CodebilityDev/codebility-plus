import ApplicantLists from "@/components/home/applicants/applicantLists";
import type { NewApplicantType } from "@/types/home/applicants/applicants";

export default function ApplicantDataWrapper({
  applicants,
}: {
  applicants: NewApplicantType[];
}) {
  if (applicants.length === 0) {
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

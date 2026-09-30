"use client";

import { useQuery } from "@tanstack/react-query";
import { getNewApplicants } from "@/actions/home/applicants/applicants-queries";
import ApplicantLists from "@/components/home/applicants/applicantLists";

export default function ApplicantDataWrapper() {
  const { data: applicants = [], isPending } = useQuery({
    queryKey: ["applicants"],
    queryFn: () => getNewApplicants(),
  });

  if (isPending) {
    return null;
  }

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

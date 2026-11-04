import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantLists from "@/components/home/applicants/applicantLists";
import {
  getApplicantCounts,
  getApplicantsByStatus,
} from "@/lib/home/applicants/applicants";
import { parseApplicantStatus } from "@/utils/home/applicants/applicant-status";

export default async function NewApplicantFetchComp({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const status = parseApplicantStatus((await searchParams).status);

  const [counts, applicants] = await Promise.all([
    getApplicantCounts(),
    getApplicantsByStatus(status),
  ]);

  return (
    <ApplicantModalProvider>
      <ApplicantLists status={status} applicants={applicants} counts={counts} />
    </ApplicantModalProvider>
  );
}

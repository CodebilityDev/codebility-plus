import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantDataWrapper from "@/components/home/applicants/ApplicantDataWrapper";
import {
  getApplicantCounts,
  getApplicantsByStatus,
} from "@/actions/home/applicants/applicants-queries";

export default async function NewApplicantFetchComp() {
  const initialStatus = "applying" as const;

  const [counts, initialApplicants] = await Promise.all([
    getApplicantCounts(),
    getApplicantsByStatus(initialStatus),
  ]);

  return (
    <ApplicantModalProvider>
      <ApplicantDataWrapper
        initialStatus={initialStatus}
        initialApplicants={initialApplicants}
        counts={counts}
      />
    </ApplicantModalProvider>
  );
}

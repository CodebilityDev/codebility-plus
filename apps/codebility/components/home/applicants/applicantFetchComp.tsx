import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantDataWrapper from "@/components/home/applicants/ApplicantDataWrapper";
import {
  getDeniedApplicantsCount,
  getNewApplicants,
} from "@/actions/home/applicants/applicants-queries";

export default async function NewApplicantFetchComp() {
  const [applicants, deniedCount] = await Promise.all([
    getNewApplicants(),
    getDeniedApplicantsCount(),
  ]);

  return (
    <ApplicantModalProvider>
      <ApplicantDataWrapper applicants={applicants} deniedCount={deniedCount} />
    </ApplicantModalProvider>
  );
}

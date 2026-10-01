import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantDataWrapper from "@/components/home/applicants/ApplicantDataWrapper";
import { getNewApplicants } from "@/actions/home/applicants/applicants-queries";

export default async function NewApplicantFetchComp() {
  const applicants = await getNewApplicants();

  return (
    <ApplicantModalProvider>
      <ApplicantDataWrapper applicants={applicants} />
    </ApplicantModalProvider>
  );
}

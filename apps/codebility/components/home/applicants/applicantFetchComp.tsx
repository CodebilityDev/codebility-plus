import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantDataWrapper from "@/components/home/applicants/ApplicantDataWrapper";
import type { NewApplicantType } from "@/types/home/applicants/applicants";

export default function NewApplicantFetchComp({
  applicants,
}: {
  applicants: NewApplicantType[];
}) {
  return (
    <ApplicantModalProvider>
      <ApplicantDataWrapper applicants={applicants} />
    </ApplicantModalProvider>
  );
}

import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantDataWrapper from "@/components/home/applicants/ApplicantDataWrapper";

export default function NewApplicantFetchComp() {
  return (
    <ApplicantModalProvider>
      <ApplicantDataWrapper />
    </ApplicantModalProvider>
  );
}

import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantDataWrapper from "@/components/home/applicants/ApplicantDataWrapper";

export default async function NewApplicantFetchComp() {
  // Wrap with client component to handle modal rendering
  return (
    <ApplicantModalProvider>
      <ApplicantDataWrapper />
    </ApplicantModalProvider>
  );
}
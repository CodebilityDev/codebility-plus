import ApplicantClientWrapper from "@/components/home/applicants/ApplicantClientWrapper";
import ApplicantDataWrapper from "@/components/home/applicants/ApplicantDataWrapper";

export default async function NewApplicantFetchComp() {
  // Wrap with client component to handle modal rendering
  return (
    <ApplicantClientWrapper>
      <ApplicantDataWrapper />
    </ApplicantClientWrapper>
  );
}
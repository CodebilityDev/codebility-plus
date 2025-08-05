// apps/codebility/app/home/applicants/_components/applicantFetchComp.tsx

import ApplicantClientWrapper from "./ApplicantClientWrapper";
import ApplicantDataWrapper from "./ApplicantDataWrapper";

export default async function NewApplicantFetchComp() {
  // Wrap with client component to handle modal rendering
  return (
    <ApplicantClientWrapper>
      <ApplicantDataWrapper />
    </ApplicantClientWrapper>
  );
}
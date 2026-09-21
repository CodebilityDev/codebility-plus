import { getApplicantStatusCounts, getApplicantsPage } from "@/actions/applicants/queries";
import ApplicantLists from "./applicantLists";

export default async function ApplicantDataWrapper() {
  const [initialData, counts] = await Promise.all([
    getApplicantsPage({ status: "applying", page: 1 }),
    getApplicantStatusCounts(),
  ]);

  return <ApplicantLists initialData={initialData} counts={counts} />;
}

import ApplicantLists from "@/components/home/applicants/applicantLists";
import type {
  ApplicantCounts,
  ApplicantStatus,
  NewApplicantType,
} from "@/types/home/applicants/applicants";

export default function ApplicantDataWrapper({
  initialStatus,
  initialApplicants,
  counts,
}: {
  initialStatus: ApplicantStatus;
  initialApplicants: NewApplicantType[];
  counts: ApplicantCounts;
}) {
  return (
    <ApplicantLists
      initialStatus={initialStatus}
      initialApplicants={initialApplicants}
      counts={counts}
    />
  );
}

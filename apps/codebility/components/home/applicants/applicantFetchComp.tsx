import ApplicantModalProvider from "@/providers/home/applicants/ApplicantModalProvider";
import ApplicantLists from "@/components/home/applicants/applicantLists";
import { pageSize } from "@/constants/global/page-size";
import {
  getApplicantCounts,
  getApplicantsPage,
} from "@/lib/home/applicants/applicants";
import { parseApplicantStatus } from "@/utils/home/applicants/applicant-status";

export default async function NewApplicantFetchComp({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = parseApplicantStatus(params.status);
  const search = params.q?.trim() ?? "";
  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const size = Number(pageSize.applicants);

  const [counts, { applicants, total }] = await Promise.all([
    getApplicantCounts(),
    getApplicantsPage({ status, page, pageSize: size, search }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / size));

  return (
    <ApplicantModalProvider>
      <ApplicantLists
        status={status}
        applicants={applicants}
        counts={counts}
        page={Math.min(page, totalPages)}
        totalPages={totalPages}
        search={search}
      />
    </ApplicantModalProvider>
  );
}

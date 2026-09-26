import { pageSize } from "@/constants/global/page-size";
import {
  getCachedCareersJobDepartments,
  getCachedCareersJobListingsPage,
} from "@/lib/global/careers-job-listings-cached";
import type { CareersJobListingsInitial } from "@/types/global/careers-job-listings";

import JobListingsShell from "@/components/marketing/careers/JobListingsShell";

const PAGE_SIZE = pageSize.careersJobs;

export default async function JobListingsSection() {
  const [pageData, departments] = await Promise.all([
    getCachedCareersJobListingsPage("", "", "", 1, PAGE_SIZE),
    getCachedCareersJobDepartments(),
  ]);

  const initialData: CareersJobListingsInitial | null =
    pageData && departments ? { ...pageData, departments } : null;

  return (
    <JobListingsShell initialData={initialData} pageSize={PAGE_SIZE} />
  );
}

import { pageSize } from "@/constants";
import {
  getCachedCareersJobDepartments,
  getCachedCareersJobListingsPage,
} from "@/lib/server/careers-job-listings-cached";
import type { CareersJobListingsInitial } from "@/types/marketing/careers-job-listings";

import JobListingsShell from "./JobListingsShell";

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

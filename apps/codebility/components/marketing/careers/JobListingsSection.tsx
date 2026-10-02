import { getCachedCareersJobDepartments, getCachedCareersJobListingsPage } from "@/lib/global/careers-job-listings-cached";
import { parsePageParam, parseStringParam } from "@/utils/global/page-param";
import type { CareersJobListingsInitial } from "@/types/global/careers-job-listings";
import type { JobListingsSectionProps } from "@/types/marketing/careers/careers";

import { JobListingsBody } from "@/components/marketing/careers/JobListingsBody";
import { PAGE_SIZE } from "@/constants/marketing/careers/careers";

export default async function JobListingsSection({ searchParams }: JobListingsSectionProps) {
  const query = await searchParams;
  const department = parseStringParam(query.department);
  const type = parseStringParam(query.type);
  const level = parseStringParam(query.level);
  const page = parsePageParam(query.page);

  const [pageData, departments] = await Promise.all([
    getCachedCareersJobListingsPage(department, type, level, page, PAGE_SIZE),
    getCachedCareersJobDepartments(),
  ]);

  const initialData: CareersJobListingsInitial | null =
    pageData && departments ? { ...pageData, departments } : null;

  return <JobListingsBody initialData={initialData} pageSize={PAGE_SIZE} />;
}

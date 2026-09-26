import JobListingsShell from "@/components/marketing/careers/JobListingsShell";
import { PAGE_SIZE } from "@/constants/marketing/careers/careers";

export function JobListingsFallback() {
  return <JobListingsShell loading pageSize={PAGE_SIZE} />;
}

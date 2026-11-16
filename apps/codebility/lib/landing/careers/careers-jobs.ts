import { getCachedCareersJobListingsPage } from "@/lib/global/careers-job-listings-cached";

export async function getCareersJobs() {
  const first = await getCachedCareersJobListingsPage("", "", "", 1, 50);
  const pages = await Promise.all(
    Array.from(
      { length: Math.max(0, first.pagination.totalPages - 1) },
      (_, index) => getCachedCareersJobListingsPage("", "", "", index + 2, 50),
    ),
  );
  return [...first.jobs, ...pages.flatMap((page) => page.jobs)];
}

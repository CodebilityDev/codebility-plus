import { CareersApplication } from "@/components/landing/careers/CareersApplication";
import { CareersListings } from "@/components/landing/careers/CareersListings";
import { getCareersJobs } from "@/lib/landing/careers/careers-jobs";
import { parseStringParam } from "@/utils/global/page-param";

export async function CareersJobs({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [jobs, params] = await Promise.all([getCareersJobs(), searchParams]);
  return (
    <CareersListings
      key={JSON.stringify([params.search, params.filter, params.location])}
      jobs={jobs ?? []}
      failed={jobs === null}
      initialSearch={parseStringParam(params.search)}
      initialFilter={parseStringParam(params.filter)}
      initialLocation={parseStringParam(params.location)}
    />
  );
}

export async function CareersApplicationData() {
  const jobs = await getCareersJobs();
  return <CareersApplication jobs={jobs ?? []} />;
}

import SectionError from "@/components/global/feedback/SectionError";
import { CareersApplication } from "@/components/landing/careers/CareersApplication";
import { CareersListings } from "@/components/landing/careers/CareersListings";
import { reportError } from "@/lib/global/error-reporting";
import { getCareersJobs } from "@/lib/landing/careers/careers-jobs";
import { parseStringParam } from "@/utils/global/page-param";

export async function CareersJobs({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [jobs, params] = await Promise.all([
    getCareersJobs().catch((error) => {
      reportError(error, {
        source: "section",
        boundary: "CareersJobs",
        route: "/careers",
        section: "careers-jobs",
      });
      return null;
    }),
    searchParams,
  ]);

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
  const jobs = await getCareersJobs().catch((error) => {
    reportError(error, {
      source: "section",
      boundary: "CareersApplication",
      route: "/careers",
      section: "careers-application",
    });
    return null;
  });

  if (!jobs) return <SectionError />;

  return <CareersApplication jobs={jobs} />;
}

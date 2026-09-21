import { getCodevStatusCounts, getCodevsPage } from "@/lib/server/codev.service";
import { getPositions, getProjectOptions, getRoles } from "@/lib/server/reference-data";

import InHouseView from "./_components/InHouseView";

const parsePage = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 1;
};

export default async function InHousePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page } = await searchParams;

  const [initialData, stats, roles, positions, projects] = await Promise.all([
    getCodevsPage({ page: parsePage(page), filters: { application_status: "passed" } }),
    getCodevStatusCounts({ application_status: "passed" }),
    getRoles(),
    getPositions(),
    getProjectOptions(),
  ]);

  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="flex flex-col gap-4 px-2 pt-4 sm:px-4 md:px-6 lg:px-8">
        <InHouseView
          initialData={initialData}
          stats={stats}
          roles={roles}
          positions={positions}
          projects={projects}
        />
      </div>
    </div>
  );
}

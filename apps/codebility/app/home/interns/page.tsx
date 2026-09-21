import PageContainer from "../_components/PageContainer";
import { getCodevStatusCounts, getInternsPage } from "@/lib/server/codev.service";
import { getPositions, getProjectOptions } from "@/lib/server/reference-data";

import CodevContainer from "./_components/CodevContainer";

const parsePage = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 1;
};

export default async function CodevsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page } = await searchParams;

  const [initialData, counts, positions, projects] = await Promise.all([
    getInternsPage({ page: parsePage(page) }),
    getCodevStatusCounts({ application_status: "passed" }),
    getPositions(),
    getProjectOptions(),
  ]);

  return (
    <PageContainer maxWidth="2xl">
      <CodevContainer
        initialData={initialData}
        counts={counts}
        positions={positions}
        projects={projects}
      />
    </PageContainer>
  );
}

import { getCachedPortfolioData } from "@/lib/landing/services/data";

import { PortfolioProjectDialog } from "@/components/landing/services/PortfolioProjectDialog";

export async function PortfolioProjectModal({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const params = await searchParams;
  const projectId = Array.isArray(params.project)
    ? params.project[0]
    : params.project;

  if (!projectId) return null;

  const data = await getCachedPortfolioData();
  const project = data.projects.find((item) => item.id === projectId);

  if (!project) return null;

  return <PortfolioProjectDialog project={project} />;
}

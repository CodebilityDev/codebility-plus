import { getCachedServicesProjectsPage } from "@/lib/global/services-projects-cached";
import { parsePageParam } from "@/utils/global/page-param";
import { parseServicesCategory } from "@/utils/global/services-categories";

import { ServicesPageContent } from "@/components/marketing/services/ServicesPageContent";
import { ClientTechyBackground } from "@/components/marketing/services/ClientTechyBackground";
import { PAGE_SIZE } from "@/constants/marketing/services/services";
import type { ServicesPageProps } from "@/types/marketing/services/services";

export async function ServicesPageView({ searchParams }: ServicesPageProps) {
  const query = await searchParams;
  const category = parseServicesCategory(query.category);
  const page = parsePageParam(query.page);
  const projectId = typeof query.project === "string" ? query.project : null;

  const initialData = await getCachedServicesProjectsPage(category, page, PAGE_SIZE);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <ClientTechyBackground />
      <div className="relative z-10">
        <ServicesPageContent
          initialData={
            initialData ?? {
              projects: [],
              pagination: {
                page,
                limit: PAGE_SIZE,
                total: 0,
                totalPages: 0,
              },
              category,
            }
          }
          pageSize={PAGE_SIZE}
          projectId={projectId}
        />
      </div>
    </div>
  );
}
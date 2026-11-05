import { getCachedServicesProjectsPage } from "@/lib/global/services-projects-cached";
import { parsePageParam } from "@/utils/global/page-param";
import { parseServicesCategory } from "@/utils/global/services-categories";

import { ServicesDetailModalSlot } from "@/components/marketing/services/ServicesDetailModalSlot";
import { ServicesTab } from "@/components/marketing/services/ServicesTab";
import { PAGE_SIZE } from "@/constants/marketing/services/services";
import type { ServicesPageProps } from "@/types/marketing/services/services";

export async function ServicesProjectsSection({
  searchParams,
}: ServicesPageProps) {
  const query = await searchParams;
  const category = parseServicesCategory(query.category);
  const page = parsePageParam(query.page);
  const projectId = typeof query.project === "string" ? query.project : null;

  const initialData = await getCachedServicesProjectsPage(
    category,
    page,
    PAGE_SIZE,
  );

  return (
    <>
      <ServicesTab
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
        category={category}
      />
      <ServicesDetailModalSlot projectId={projectId} />
    </>
  );
}

import { pageSize } from "@/constants";
import { getCachedServicesProjectsPage } from "@/lib/server/services-projects-cached";

import { ServicesPageContent } from "../_components/layout";
import { ClientTechyBackground } from "../_components/visuals";

const PAGE_SIZE = pageSize.services;

export async function ServicesPageView() {
  const initialData = await getCachedServicesProjectsPage("all", 1, PAGE_SIZE);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <ClientTechyBackground />
      <div className="relative z-10">
        <ServicesPageContent
          initialData={
            initialData ?? {
              projects: [],
              pagination: {
                page: 1,
                limit: PAGE_SIZE,
                total: 0,
                totalPages: 0,
              },
              category: "all",
            }
          }
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
}

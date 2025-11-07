import { getPublicProjects } from "@/lib/server/project.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import { createClientServerComponent } from "@/utils/supabase/server";

import Navigation from "../_components/MarketingNavigation";
import ClientTechyBackground from "./_components/ClientTechyBackground";
import { ServicesPageContent } from "./_components/ServicesPageContent";
import { servicesData } from "./_lib/dummy-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
  role?: string;
  joined_at?: string;
}

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  github_link?: string;
  main_image?: string;
  website_url?: string;
  figma_link?: string;
  client_id?: string;
  members?: TeamMember[];
  categories?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  created_at?: string;
  updated_at?: string;
  tech_stack?: string[];
}

const ServicesPage = async () => {
  const supabase = await createClientServerComponent();

  const data = await getOrSetCache(cacheKeys.projects.all, () =>
    getPublicProjects(),
  );

  const mappedData: ProjectData[] = data.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    main_image: item.main_image || "",
    website_url: item.website_url || "",
    github_link: item.github_link || "",
    figma_link: item.figma_link || "",
    start_date: item.start_date || "",
    end_date: item.end_date || "",
    categories: item.categories || [],
    client_id: item.client_id,
    members:
      item.project_members
        ?.map((pm: any) => ({
          ...pm.codev,
          role: pm.role,
          joined_at: pm.joined_at,
        }))
        .filter(Boolean) || [],
    tech_stack: item.tech_stack || [],
  }));

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <ClientTechyBackground />
      <div className="relative z-10">
        <Navigation />
        <ServicesPageContent servicesData={mappedData} />
      </div>
    </div>
  );
};
export default ServicesPage;

import getProjects from "@/lib/server/project.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import { createClientServerComponent } from "@/utils/supabase/server";

import Calendly from "../_components/MarketingCalendly";
import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import Hero from "./_components/ServicesHero";
import ServicesTab from "./_components/ServicesTab";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
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
  project_category_id?: number;
  project_category_name?: string;
  created_at?: string;
  updated_at?: string;
}

const ServicesPage = async () => {
  const supabase = await createClientServerComponent();

  const data = await getOrSetCache(cacheKeys.projects.all, () => getProjects());

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
    project_category_id: item.projects_category?.id || 0,
    project_category_name: item.projects_category?.name || "",
    client_id: item.client_id,
    members:
      item.project_members?.map((pm: any) => pm.codev).filter(Boolean) || [],
  }));

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <Navigation />
      <Hero />
      <ServicesTab servicesData={mappedData} />
      <Calendly />
      <Footer />
    </div>
  );
};
export default ServicesPage;

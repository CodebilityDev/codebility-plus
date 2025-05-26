"use client";

import { useEffect, useState } from "react";


import Calendly from "../_components/MarketingCalendly";
import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import Hero from "./_components/ServicesHero";
import ServicesTab from "./_components/ServicesTab";
import { createClientClientComponent } from "@/utils/supabase/client";

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

export default function ServicesPage() {
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientClientComponent();

  useEffect(() => {
    async function fetchProjects() {
      setIsLoading(true);
      try {
        // Modified query to remove the team_leader_id reference that doesn't exist
        const { data, error } = await supabase.from("projects").select(
          `
            id, 
            name, 
            description,
            website_url,
            main_image,
            github_link,
            figma_link,
            start_date,
            end_date,
            client_id,
            project_category_id,
            project_members!left(
              codev:codev_id(
                id,
                first_name,
                last_name,
                image_url
              )
            ),
            projects_category(
              id,
              name
            )
          `,
        ); // Removed status filter to see if any projects exist
        if (error) {
          console.error("Error fetching projects:", error);
          setError(error.message);
          return;
        }

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
            item.project_members?.map((pm: any) => pm.codev).filter(Boolean) ||
            [],
        }));

        console.log("Fetched projects data:", mappedData);
        setProjectsData(mappedData);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred while fetching projects");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [supabase]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <Navigation />
      <Hero />
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="px-6 py-12 text-center text-red-500">
          <p>Error loading projects: {error}</p>
        </div>
      ) : (
        <ServicesTab servicesData={projectsData} />
      )}
      <Calendly />
      <Footer />
    </div>
  );
}

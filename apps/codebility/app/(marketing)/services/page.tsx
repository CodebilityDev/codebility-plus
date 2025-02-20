"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import Calendly from "../_components/MarketingCalendly";
import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import Hero from "./_components/ServicesHero";
import ServicesTab from "./_components/ServicesTab";

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
  team_leader?: TeamMember;
  client_id?: string;
  members?: TeamMember[];
  project_category_id?: number;
  project_category_name?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ServicesPage() {
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select(
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
          team_leader:team_leader_id(
            id,
            first_name,
            last_name,
            image_url
          ),
          project_members!left(
            codev:codev_id(
              id,
              first_name,
              last_name,
              image_url
            )
          ),
          projects_category!inner(
            id,
            name
          )
        `,
        )
        .eq("status", "inprogress");

      if (error) {
        console.error("Error fetching projects:", error);
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
        team_leader: item.team_leader,
        members: item.project_members?.map((pm: any) => pm.codev) || [],
        created_at: "",
        updated_at: "",
      }));

      setProjectsData(mappedData);
    }

    fetchProjects();
  }, [supabase]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303]">
      <Navigation />
      <Hero />
      <ServicesTab servicesData={projectsData} />
      <Calendly />
      <Footer />
    </div>
  );
}

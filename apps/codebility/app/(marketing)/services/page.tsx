import { use } from "react";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import Calendly from "../_components/marketing-calendly";
import Footer from "../_components/marketing-footer";
import Navigation from "../_components/marketing-navigation";
import { PoppinFont } from "../_lib/font";
import Hero from "./_components/services-hero";
import ServicesTab from "./_components/services-tab";

export default function ServicesPage() {
  const supabase = getSupabaseServerComponentClient();

  const liveProjects = use(
    supabase
      .from("projects")
      .select(
        `
        id, 
        name, 
        description,
        website_url,
        client_id,
        project_category: projects_category!inner(name)
      `,
      )
      .eq("status", "active")
      .then(({ data, error }) => {
        if (error) throw error;

        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.name,
          category: (item.project_category as unknown as { name: string }).name,
          description: item.description,
          mainImage: item.website_url,
        }));

        return formattedData;
      }),
  );

  // temporary fix to maintain [Web Application, Mobile Application, Product Design] tab order
  const codebility = liveProjects.find((item) => item.name === "Codebility");
  const rest = liveProjects.filter((item) => item.name !== "Codebility");

  const projectsData = [codebility, ...rest];

  return (
    <div
      className={`relative flex w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303] ${PoppinFont.className}`}
    >
      <Navigation />
      <Hero />
      <ServicesTab servicesData={projectsData} />
      <Calendly />
      <Footer />
    </div>
  );
}

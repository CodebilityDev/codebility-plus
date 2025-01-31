import { use } from "react";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import Calendly from "../_components/marketing-calendly";
import Footer from "../_components/marketing-footer";
import Navigation from "../_components/marketing-navigation";
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

        // Map data to match Project interface
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          main_image: item.website_url || "",
          github_link: "", // Add other fields from Project if required
          figma_link: "",
          start_date: "",
          end_date: "",
          project_category_id: 0, // Replace with actual category ID logic
          client_id: item.client_id,
          members: [],
          created_at: "",
          updated_at: "",
        }));
      }),
  );

  // Find "Codebility" project and filter the rest
  const codebility = liveProjects.find((item) => item.name === "Codebility");
  const rest = liveProjects.filter((item) => item.name !== "Codebility");

  // Filter out undefined and construct final projectsData
  const projectsData = [codebility, ...rest].filter(
    (project): project is NonNullable<typeof project> => project !== undefined,
  );

  return (
    <div
      className={`relative flex w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303] `}
    >
      <Navigation />
      <Hero />
      <ServicesTab servicesData={projectsData} />
      <Calendly />
      <Footer />
    </div>
  );
}

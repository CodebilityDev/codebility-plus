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

  const services = use(
    supabase
      .from("services")
      .select("*")
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
  );

  const liveProjects = use(
    supabase
      .from("project")
      .select(
        `id, name, summary, thumbnail, project_category: project_categories!inner(type)`,
      )
      .eq("is_displayed", true)
      .then(({ data, error }) => {
        if (error) throw error;

        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.name,
          category: (item.project_category as unknown as { type: string }).type,
          description: item.summary,
          mainImage: item.thumbnail,
        }));

        return formattedData;
      }),
  );

  const combinedProjectsAndServices = [...liveProjects, ...services];

  return (
    <div
      className={`relative flex w-full flex-col overflow-x-hidden overflow-y-hidden bg-[#030303] ${PoppinFont.className}`}
    >
      <Navigation />
      <Hero />

      <ServicesTab servicesData={combinedProjectsAndServices} />
      <Calendly />
      <Footer />
    </div>
  );
}

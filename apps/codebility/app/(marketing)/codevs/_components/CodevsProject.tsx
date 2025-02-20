import React from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { EmblaOptionsType } from "embla-carousel";

import EmblaCarousel from "./CodevsCarousel";

interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  main_image?: string;
  status?: string;
}

export default async function ProjectSection() {
  const supabase = createServerComponentClient({ cookies });

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, description, main_image, status")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const OPTIONS: EmblaOptionsType = {
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  };

  const slides =
    projects
      ?.map((project) =>
        project.main_image?.startsWith("public")
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${project.main_image}`
          : project.main_image || "",
      )
      .filter(Boolean) || [];

  if (error) {
    console.error("Error loading projects:", error);
    return null;
  }

  return (
    <section className="bg-black-400 relative flex min-h-screen w-full flex-col justify-center text-center">
      <div className="mb-10 space-y-2">
        <h1 className="text-2xl font-bold uppercase tracking-[0.7em] text-white lg:text-4xl">
          Our Featured
        </h1>
        <p className="text-teal text-lg font-bold lg:text-2xl">internal</p>
        <h1 className="text-3xl font-normal uppercase -tracking-widest text-white lg:text-5xl">
          Projects
        </h1>
      </div>

      {slides.length > 0 ? (
        <EmblaCarousel slides={slides} options={OPTIONS} />
      ) : (
        <div className="text-center text-white">No projects available</div>
      )}
    </section>
  );
}

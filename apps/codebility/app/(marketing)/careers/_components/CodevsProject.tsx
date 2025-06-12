"use server";

import React from "react";
import { createClientServerComponent } from "@/utils/supabase/server";
import { EmblaOptionsType } from "embla-carousel";

import EmblaCarousel from "./CodevsCarousel";
import Section from "./CodevsSection";

interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  main_image?: string;
  status?: string;
}

export default async function ProjectSection() {
  const supabase = await createClientServerComponent();

  // First, check if we can get ANY projects (without filters)
  const { data: allProjects, error: allProjectsError } = await supabase
    .from("projects")
    .select("id, name, description, main_image, status")
    .order("created_at", { ascending: false })
    .limit(10);

  // Then, try with the status filter
  const { data: activeProjects, error } = await supabase
    .from("projects")
    .select("id, name, description, main_image, status")
    .order("created_at", { ascending: false });

  if (error || allProjectsError || !activeProjects || !allProjects) {
    console.error("Error loading projects:", error);
    return (
      <section className="bg-black-400 relative flex min-h-screen w-full flex-col justify-center text-center ">
        <div className="mb-10 space-y-2">
          <h1 className="text-2xl font-bold uppercase tracking-[0.7em] text-white lg:text-4xl">
            Our Featured
          </h1>
          <p className="text-teal text-lg font-bold lg:text-2xl">internal</p>
          <h1 className="text-3xl font-normal uppercase -tracking-widest text-white lg:text-5xl">
            Projects
          </h1>
        </div>
        <div className="text-center text-white">
          Error loading projects. Please try again.
        </div>
      </section>
    );
  }

  const OPTIONS: EmblaOptionsType = {
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
  };

  // Process the main_image URLs and create slides array
  const slides: string[] = [];
  const projectsWithImages: (Project & { imageUrl: string })[] = [];

  if (activeProjects && activeProjects.length > 0) {
    for (const project of activeProjects) {
      if (project.main_image) {
        let imageUrl = project.main_image;

        // Transform URL if needed
        if (imageUrl.startsWith("public")) {
          imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/services-image/${imageUrl}`;
        }

        // Store both the image URL and project data
        projectsWithImages.push({
          ...project,
          imageUrl,
        });

        // Add to slides for the carousel
        slides.push(imageUrl);
      }
    }
  }

  return (
    <Section className="bg-black-400 relative mt-10 flex  w-full flex-col justify-center text-center ">
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
        <div className="flex flex-col items-center justify-center text-white">
          <p className="mb-2">No projects available</p>
          <p className="text-sm text-gray-400">
            (Found {allProjects?.length || 0} total projects,{" "}
            {activeProjects?.length || 0} active projects)
          </p>
        </div>
      )}
    </Section>
  );
}

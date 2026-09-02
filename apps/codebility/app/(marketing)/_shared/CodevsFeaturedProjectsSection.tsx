import { EmblaOptionsType } from "embla-carousel";

import { getCachedCodevsFeaturedProjects } from "@/lib/server/codevs-featured-projects-cached";

import { CodevsFeaturedProjectsAnimated } from "./CodevsFeaturedProjectsAnimated";

const CAROUSEL_OPTIONS: EmblaOptionsType = {
  loop: true,
  align: "center",
  containScroll: "trimSnaps",
};

export default async function CodevsFeaturedProjectsSection() {
  const data = await getCachedCodevsFeaturedProjects();

  if (!data) {
    return (
      <section className="bg-black-400 relative flex min-h-screen w-full flex-col justify-center text-center">
        <div className="mb-10 space-y-2">
          <h1 className="text-2xl font-bold uppercase tracking-[0.7em] text-white lg:text-4xl">
            Our Featured
          </h1>
          <p className="text-customTeal text-lg font-bold lg:text-2xl">
            internal
          </p>
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

  return (
    <CodevsFeaturedProjectsAnimated
      slides={data.slides}
      options={CAROUSEL_OPTIONS}
    />
  );
}

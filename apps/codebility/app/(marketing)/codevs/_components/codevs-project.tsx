import React from "react"
import { EmblaOptionsType } from "embla-carousel"
import EmblaCarousel from "./codevs-carousel"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"

export default async function Project() {
  const supabase = getSupabaseServerComponentClient();
  const { data: projects } = await supabase.from("project")
  .select();

  const OPTIONS: EmblaOptionsType = { loop: true }
  
  const slides = projects?.filter(project => project.thumbnail).map(project => project.thumbnail) as string[];
/*   const SLIDES = ["/assets/images/codebility-home.jpg", "/assets/images/campaign/inquire.png", "/assets/images/services/social-networking-app.png", "/assets/images/services/e-commerce-app.png"] */
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center bg-black-400 text-center">
      <div className="gap-2">
        <h1 className="text-2xl font-bold uppercase tracking-[0.7em] text-white lg:text-4xl">Our Featured</h1>
        <p className="text-lg font-bold text-teal lg:text-2xl">internal</p>
        <h1 className="text-3xl font-normal uppercase -tracking-widest text-white lg:text-5xl">Projects</h1>
      </div>
      <EmblaCarousel slides={slides} options={OPTIONS} />
    </section>
  )
}

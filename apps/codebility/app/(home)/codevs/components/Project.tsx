import React from "react"
import { EmblaOptionsType } from "embla-carousel"
import EmblaCarousel from "@/app/(home)/codevs/components/Carousel"

export default function Project() {
  const OPTIONS: EmblaOptionsType = { loop: true }
 
  const SLIDES = ["/assets/images/codebility-home.jpg", "/assets/images/campaign/inquire.png", "/assets/images/services/social-networking-app.png", "/assets/images/services/e-commerce-app.png"]
  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center bg-black-400 text-center">
      <div className="gap-2">
        <h1 className="text-2xl font-bold uppercase tracking-[0.7em] text-white lg:text-4xl">Our Featured</h1>
        <p className="text-lg font-bold text-teal lg:text-2xl">internal</p>
        <h1 className="text-3xl font-normal uppercase -tracking-widest text-white lg:text-5xl">Projects</h1>
      </div>
      <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    </section>
  )
}
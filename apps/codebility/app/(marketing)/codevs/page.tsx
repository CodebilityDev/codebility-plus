"use client"

import Navigation from "@/app/(marketing)/Navigation"
import Profiles from "@/app/(marketing)/profiles/page"
import Hero from "@/app/(marketing)/codevs/components/Hero"
import Footer from "@/app/(marketing)/Footer"
import MissionVision from "@/app/(marketing)/codevs/components/MissionVision"
import FeaturedSection from "@/app/(marketing)/codevs/components/FeaturedSection" 
import Project from "@/app/(marketing)/codevs/components/Project"
import CTA from "@/app/(marketing)/codevs/components/CTA"
import Roadmap from "@/app/(marketing)/codevs/components/Roadmap"

const Codevs = () => {
  return (
    <div className="relative flex w-full flex-col overflow-x-hidden overflow-y-hidden bg-black-400">
      <Navigation />
      <Hero />
      <FeaturedSection />
      <Project />
      <Profiles />
      <Roadmap />
      <MissionVision />
      <CTA />
      <Footer />
    </div>
  )
}

export default Codevs

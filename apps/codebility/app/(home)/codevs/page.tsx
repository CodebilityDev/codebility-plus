"use client"

import Navigation from "@/app/(home)/Navigation"
import Profiles from "@/app/(home)/profiles/page"
import Hero from "@/app/(home)/codevs/components/Hero"
import Footer from "@/app/(home)/Footer"
import MissionVision from "@/app/(home)/codevs/components/MissionVision"
import FeaturedSection from "@/app/(home)/codevs/components/FeaturedSection" 
import Project from "@/app/(home)/codevs/components/Project"
import CTA from "@/app/(home)/codevs/components/CTA"
import Roadmap from "@/app/(home)/codevs/components/Roadmap"

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

"use client"

import Navigation from "../_components/marketing-navigation"
import Profiles from "../profiles/page"
import Hero from "./components/Hero"
import Footer from "../_components/marketing-footer"
import MissionVision from "./components/MissionVision"
import FeaturedSection from "./components/FeaturedSection" 
import Project from "./components/Project"
import CTA from "./components/CTA"
import Roadmap from "./components/Roadmap"

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

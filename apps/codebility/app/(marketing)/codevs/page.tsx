import Navigation from "../_components/marketing-navigation"
import Profiles from "../profiles/page"
import Hero from "./_components/codevs-hero"
import Footer from "../_components/marketing-footer"
import MissionVision from "./_components/codevs-mission-vision"
import FeaturedSection from "./_components/codevs-featured-section" 
import Project from "./_components/codevs-project"
import CTA from "./_components/codevs-cta"
import Roadmap from "./_components/codevs-roadmap"

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

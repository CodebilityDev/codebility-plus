import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import Profiles from "../profiles/page";
import CTA from "./_components/CodevsCta";
import FeaturedSection from "./_components/CodevsFeaturedCection";
import Hero from "./_components/CodevsHero";
import MissionVision from "./_components/CodevsMissionVision";
import Project from "./_components/CodevsProject";
import Roadmap from "./_components/CodevsRoadmap";

export default function Codevs() {
  return (
    <div className="bg-black-400 relative flex w-full flex-col">
      {/* <Navigation />
      <Hero />
      <Profiles />
      <FeaturedSection />
      <Project />
      <Roadmap />
      <MissionVision />
      <CTA />
      <Footer /> */}
      <Navigation />
      <Hero />
      <Profiles />
      <FeaturedSection />
      <Project />
      <Roadmap />
      <MissionVision />
      <CTA />
      <Footer />
    </div>
  );
}

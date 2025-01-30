import Footer from "../_components/marketing-footer";
import Navigation from "../_components/marketing-navigation";
import Profiles from "../profiles/page";
import CTA from "./_components/codevs-cta";
import FeaturedSection from "./_components/codevs-featured-section";
import Hero from "./_components/codevs-hero";
import MissionVision from "./_components/codevs-mission-vision";
import Project from "./_components/codevs-project";
import Roadmap from "./_components/codevs-roadmap";

const Codevs = () => {
  return (
    <div className="bg-black-400 relative flex w-full flex-col">
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
  );
};

export default Codevs;

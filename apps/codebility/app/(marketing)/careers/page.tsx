import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import Profiles from "../profiles/page";
import CTA from "./_components/CodevsCta";
import FeaturedSection from "./_components/CodevsFeaturedCection";
import CodevHero from "./_components/CodevsHero";
import MissionVision from "./_components/CodevsMissionVision";
import Project from "./_components/CodevsProject";
import Roadmap from "./_components/CodevsRoadmap";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Codevs() {
  return (
    <div className="bg-black-400 relative flex w-full flex-col">
      <Navigation />
      <CodevHero />
      {/*     <Profiles /> */}
      <FeaturedSection />
      <Project />
      <Roadmap />
      <MissionVision />
      <CTA />
      <Footer />
    </div>
  );
}

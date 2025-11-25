import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import FeaturedSection from "../_shared/CodevsFeaturedCection";
import Hero from "./_components/CodevsHero";
import Project from "./_components/CodevsProject";
import CodevsRoadmapStatic from "./_components/CodevsRoadmapStatic";
import MissionVision from "./_components/CodevsMissionVision";
import CTA from "../_shared/CodevsCta";
import CodevsProfiles from "./_components/CodevsProfiles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Codevs() {
  return (
    <div className="bg-black-400 relative flex w-full flex-col">
      <Navigation />
      <Hero />
      <CodevsProfiles />
      <FeaturedSection />
      <Project />
      <CodevsRoadmapStatic />
      <MissionVision />
      <CTA />
      <Footer />
    </div>
  );
}

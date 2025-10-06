import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import Profiles from "../profiles/page";
import WorkplaceCulture from "./_components/WorkplaceCulture";
import CodevHero from "./_components/CodevsHero";
import JobListings from "./_components/JobListings";
import TechStack from "./_components/TechStack";
import CareerGrowthPath from "./_components/CareerGrowthPath";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Codevs() {
  return (
    <div className="bg-black-400 relative flex w-full flex-col">
      <Navigation />
      <CodevHero />
      {/*     <Profiles /> */}
      <JobListings />
      <WorkplaceCulture />
      <TechStack />
      <CareerGrowthPath />
      <Footer />
    </div>
  );
}

import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import Profiles from "../profiles/page";
import FeaturedSection from "../_shared/CodevsFeaturedCection";
import Hero from "./_components/CodevsHero";
import Project from "./_components/CodevsProject";
import HiringProcess from "./_components/HiringProcess";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HireACodev() {
  return (
    <div className="bg-black-400 relative flex w-full flex-col">
      <Navigation />
      <Hero />
      <HiringProcess />
      <Profiles />
      <FeaturedSection />
      <Project />
      <Footer />
    </div>
  );
}

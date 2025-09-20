import Admins from "./_components/landing/LandingAdmins";
import Features from "./_components/landing/LandingFeatures";
import Hero from "./_components/landing/LandingHero";
import Parallax from "./_components/landing/LandingParallax";
import Partners from "./_components/landing/LandingPartners";
import WhyChooseUs from "./_components/landing/LandingWhyChoose-us";
import WorkWithUs from "./_components/landing/LandingWorkWithUs";
import Calendly from "./_components/MarketingCalendly";
import Footer from "./_components/MarketingFooter";
import Navigation from "./_components/MarketingNavigation";
import Testimonials from "./_components/testimonial/Testimonials";
import CodevLandingHero from "./careers/_components/CodevLandingHero";
import InternSectionContainer from "./_components/landing/LandingInternSection";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Index() {
  return (
    <div
      className={`bg-black-400 relative flex w-full flex-col overflow-x-hidden overflow-y-hidden `}
    >
      <Navigation /> 
      <Hero />
      <CodevLandingHero />
      <Features />
      <Parallax />
      <WhyChooseUs />
      <WorkWithUs />
      <Admins />
      <InternSectionContainer />
      <Partners />
      <Testimonials />
      <Calendly />
      <Footer /> 
    </div>
  );
}

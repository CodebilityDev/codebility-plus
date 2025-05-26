"use server";

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

export default async function Index() {
  return (
    <div
      className={`bg-black-400 relative flex w-full flex-col overflow-x-hidden overflow-y-hidden `}
    >
      <Navigation />
      <Hero />
      <Features />
      <Parallax />
      <WhyChooseUs />
      <WorkWithUs />
      <Admins />
      <Partners />
      <Calendly />
      <Footer />
    </div>
  );
}

import { Metadata } from "next";

import Admins from "@/components/marketing/LandingAdmins";
import Features from "@/components/marketing/LandingFeatures";
import Hero from "@/components/marketing/LandingHero";
import InternSectionContainer from "@/components/marketing/LandingInternSection";
import Partners from "@/components/marketing/LandingPartners";
import WhyChooseUs from "@/components/marketing/LandingWhyChoose-us";
import WorkWithUs from "@/components/marketing/LandingWorkWithUs";
import Calendly from "@/components/global/marketing/MarketingCalendly";

export const metadata: Metadata = {
  title: "Codebility — Hire Skilled Filipino Developers",
  description:
    "Codebility connects you with vetted Filipino software developers. Build your team faster with top-tier tech talent.",
  alternates: { canonical: "https://www.codebility.tech" },
  openGraph: {
    title: "Codebility — Hire Skilled Filipino Developers",
    description:
      "Codebility connects you with vetted Filipino software developers. Build your team faster with top-tier tech talent.",
    url: "https://www.codebility.tech",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Codebility — Hire Skilled Filipino Developers",
    description:
      "Codebility connects you with vetted Filipino software developers.",
    images: ["/og-image.jpg"],
  },
};

export default function Index() {
  return (
    <>
      <Hero />
      <Features />
      <WhyChooseUs />
      <WorkWithUs />
      <Admins />
      <InternSectionContainer />
      <Partners />
      <Calendly />
    </>
  );
}

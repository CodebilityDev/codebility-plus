import { Metadata } from "next";

import Admins from "./_components/landing/LandingAdmins";
import Features from "./_components/landing/LandingFeatures";
import Hero from "./_components/landing/LandingHero";
import InternSectionContainer from "./_components/landing/LandingInternSection";
import Partners from "./_components/landing/LandingPartners";
import WhyChooseUs from "./_components/landing/LandingWhyChoose-us";
import WorkWithUs from "./_components/landing/LandingWorkWithUs";
import Calendly from "./_components/MarketingCalendly";
import Footer from "./_components/MarketingFooter";
import Testimonials from "./_components/testimonial/Testimonials";
import Navigation from "./_components/MarketingNavigation";

export const metadata: Metadata = {
    title: "Codebility — Hire Skilled Filipino Developers",
    description: "Codebility connects you with vetted Filipino software developers. Build your team faster with top-tier tech talent.",
    alternates: { canonical: "https://www.codebility.tech" },
    openGraph: {
        title: "Codebility — Hire Skilled Filipino Developers",
        description: "Codebility connects you with vetted Filipino software developers. Build your team faster with top-tier tech talent.",
        url: "https://www.codebility.tech",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Codebility — Hire Skilled Filipino Developers",
        description: "Codebility connects you with vetted Filipino software developers.",
        images: ["/og-image.jpg"],
    },
};

export default async function Index() {
    return (
        <div className="bg-black-400 relative w-full overflow-x-hidden">
            <Navigation />
            {/* <Hero />
            <Features />
            <WhyChooseUs />
            <WorkWithUs />
            <Admins />
            <InternSectionContainer />
            <Partners />
            <Testimonials />
            <Calendly />
            <Footer /> */}
        </div>
    );
}
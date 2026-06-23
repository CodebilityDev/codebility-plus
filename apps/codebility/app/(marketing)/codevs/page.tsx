import { Metadata } from "next";

import Footer from "../_components/MarketingFooter";
import Navigation from "../_components/MarketingNavigation";
import FeaturedSection from "../_shared/CodevsFeaturedCection";
import Hero from "./_components/CodevsHero";
import Project from "./_components/CodevsProject";
import CodevsRoadmapStatic from "./_components/CodevsRoadmapStatic";
import MissionVision from "./_components/CodevsMissionVision";
import CTA from "../_shared/CodevsCta";
import CodevsProfiles from "./_components/CodevsProfiles";

export const metadata: Metadata = {
    title: "Our Developers — Meet the Codebility Team",
    description: "Meet the developers behind Codebility. Browse profiles, skill sets, and featured projects from our growing community.",
    alternates: { canonical: "https://www.codebility.tech/codevs" },
    openGraph: {
        title: "Our Developers | Codebility",
        description: "Meet the skilled developers powering Codebility projects.",
        url: "https://www.codebility.tech/codevs",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility Developers" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Our Developers | Codebility",
        description: "Meet the skilled developers powering Codebility projects.",
        images: ["/og-image.jpg"],
    },
};

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
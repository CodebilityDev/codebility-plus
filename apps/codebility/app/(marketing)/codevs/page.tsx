import { Metadata } from "next";

import FeaturedSection from "../_shared/CodevsFeaturedCection";
import CodevsFeaturedProjectsSection from "../_shared/CodevsFeaturedProjectsSection";
import CodevsProfiles from "../_shared/CodevsProfiles";
import CTA from "../_shared/CodevsCta";
import Hero from "./_components/CodevsHero";
import CodevsRoadmapStatic from "./_components/CodevsRoadmapStatic";
import MissionVision from "./_components/CodevsMissionVision";

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

export default function Codevs() {
    return (
        <div className="bg-black-400 relative flex w-full flex-col">
            <Hero />
            <CodevsProfiles />
            <FeaturedSection />
            <CodevsFeaturedProjectsSection />
            <CodevsRoadmapStatic />
            <MissionVision />
            <CTA />
        </div>
    );
}
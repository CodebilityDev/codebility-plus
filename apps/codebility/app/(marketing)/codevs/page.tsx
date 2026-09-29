import type { Metadata } from "next";

import FeaturedSection from "@/components/global/marketing/CodevsFeaturedSection";
import CodevsFeaturedProjectsSection from "@/components/global/marketing/CodevsFeaturedProjectsSection";
import CodevsProfiles from "@/components/global/marketing/CodevsProfiles";
import CTA from "@/components/marketing/codevs/CodevsCta";
import Hero from "@/components/marketing/codevs/CodevsHero";
import CodevsRoadmapStatic from "@/components/marketing/codevs/CodevsRoadmapStatic";
import MissionVision from "@/components/marketing/codevs/CodevsMissionVision";

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
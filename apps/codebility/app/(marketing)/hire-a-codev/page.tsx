import { Metadata } from "next";

import Footer from "../_components/MarketingFooter";
import MarketingSCNavigation from "../_components/MarketingSCNavigation";
import Profiles from "../profiles/page";
import FeaturedSection from "../_shared/CodevsFeaturedCection";
import Hero from "./_components/CodevsHero";
import Project from "./_components/CodevsProject";
import HiringProcess from "./_components/HiringProcess";

export const metadata: Metadata = {
    title: "Hire a Developer — Vetted Filipino Tech Talent | Codebility",
    description: "Hire skilled Filipino software developers through Codebility. Browse developer profiles and start building your team today.",
    alternates: { canonical: "https://www.codebility.tech/hire-a-codev" },
    openGraph: {
        title: "Hire a Developer | Codebility",
        description: "Browse vetted Filipino developers and hire your next team member through Codebility.",
        url: "https://www.codebility.tech/hire-a-codev",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Hire a Developer at Codebility" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Hire a Developer | Codebility",
        description: "Browse vetted Filipino developers and hire your next team member.",
        images: ["/og-image.jpg"],
    },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HireACodev() {
    return (
        <div className="bg-black-400 relative flex w-full flex-col">
            <MarketingSCNavigation />
            <Hero />
            <HiringProcess />
            <Profiles />
            <FeaturedSection />
            <Project />
            <Footer />
        </div>
    );
}
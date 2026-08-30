import { Metadata } from "next";

import FeaturedSection from "../_shared/CodevsFeaturedCection";
import CodevsFeaturedProjectsSection from "../_shared/CodevsFeaturedProjectsSection";
import CodevsProfiles from "../_shared/CodevsProfiles";
import { CodevHireCodevModal } from "../profiles/_components/CodevHireCodevModal";
import Hero from "./_components/CodevsHero";
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

export default function HireACodev() {
    return (
        <div className="bg-black-400 relative flex w-full flex-col">
            <Hero />
            <HiringProcess />
            <CodevsProfiles />
            <FeaturedSection />
            <CodevsFeaturedProjectsSection />
            <CodevHireCodevModal />
        </div>
    );
}

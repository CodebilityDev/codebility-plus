import type { Metadata } from "next";

import FeaturedSection from "@/components/global/marketing/CodevsFeaturedSection";
import CodevsFeaturedProjectsSection from "@/components/global/marketing/CodevsFeaturedProjectsSection";
import CodevsProfiles from "@/components/global/marketing/CodevsProfiles";
import { CodevHireCodevModal } from "@/components/global/marketing/CodevHireCodevModal";
import Hero from "@/components/marketing/hire-a-codev/CodevsHero";
import HiringProcess from "@/components/marketing/hire-a-codev/HiringProcess";
import type { CodevsProfilesProps } from "@/types/global/marketing";

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

export default function HireACodev({ searchParams }: CodevsProfilesProps) {
    return (
        <div className="bg-black-400 relative flex w-full flex-col">
            <Hero />
            <HiringProcess />
            <CodevsProfiles searchParams={searchParams} />
            <FeaturedSection />
            <CodevsFeaturedProjectsSection />
            <CodevHireCodevModal />
        </div>
    );
}
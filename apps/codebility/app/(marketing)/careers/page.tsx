import { Metadata } from "next";

import CareerGrowthPath from "@/components/marketing/careers/CareerGrowthPath";
import { JobListingsBlock } from "@/components/marketing/careers/JobListingsBlock";
import CodevHero from "@/components/marketing/careers/CodevsHero";
import TechStack from "@/components/marketing/careers/TechStack";
import WorkplaceCulture from "@/components/marketing/careers/WorkplaceCulture";

export const metadata: Metadata = {
    title: "Careers — Join Codebility as a Developer",
    description: "Join Codebility and grow your software development career. Browse open roles, job listings, and our tech stack.",
    alternates: { canonical: "https://www.codebility.tech/careers" },
    openGraph: {
        title: "Careers — Join Codebility as a Developer",
        description: "Browse open developer roles at Codebility and take your career to the next level.",
        url: "https://www.codebility.tech/careers",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility Careers" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Careers | Codebility",
        description: "Browse open developer roles at Codebility.",
        images: ["/og-image.jpg"],
    },
};

export default function Careers() {
    return (
        <div className="bg-black-400 relative flex w-full flex-col">
            <CodevHero />
            <JobListingsBlock />
            <WorkplaceCulture />
            <TechStack />
            <CareerGrowthPath />
        </div>
    );
}
